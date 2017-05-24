'use strict'

const request = require('request')
  const confusionMatrix = require('./utils/confusion-matrix')
const Envelope = require('envelope')

let _discMessage = {
  id: '',
  source_id: '',
  source_email: {
    body: '',
    subject: ''
  },
  exception: [],
  start_date_time: '',
  end_date_time: '',
  successfully_processed: false,
  transaction_types: [],
  toc: [],
  topTransactionActual: '',
  topTransactionPredicted: '',
  ground_truth: {},
  entities_extracted: []
}

const _categorize = (message) => {
  /*
  console.log('================ _categorize() Inbound Message =================')
  console.log(message)
  console.log('================ _categorize() End of Message ==================')
  */
  const options = {
    method: 'POST',
    uri: process.env.MSG_CLASSIFIER_URL,
    body: message,
    json: true
    // JSON stringifies the body automatically
  }
  /*
  console.log('=============== _categorize() options ==================')
  console.log(options)
  console.log('=============== _categorize() end of options ==================')
  */
  // Return a promise
  return new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
      if (err) {
        console.error('SmartEmail._categorize() -- FAILED ', err)
        reject(err)
      }
      //      console.log('SmartEmail._categorize() RESPONSE: ', res.statusCode)
      if (res.statusCode === 200) {
        // combine the objects
        console.log('SmartEmail._categorize() SUCCESS!')
        Object.assign(message, body)
      } else {
        // if there was an exception, add it to the message
        console.log('SmartEmail._categorize() ERROR: ', res.statusCode)
        console.log('SmartEmail._categorize() ERROR: ', body)
        message.exception = ['Categorize ' + body]
      }
      resolve(message)
    })
  })
}


const findClosing = (text) => {
  let closings = ['Thanks', 'Thank you', 'Regards', 'Best Wishes', 'Have a great day']
  let pattern = '^'+closings.join('|^')
  let regex = new RegExp(pattern, 'i')
  return text.split('\r\n').findIndex((element) => {
    return (regex.exec(element) !== null)
  })
}
const getBody = (text) => {
  let remainderStart = findClosing(text)
  let body = text.split('\r\n').slice(0,remainderStart).join('\r\n')
  let remainder = text.split('\r\n').slice(remainderStart).join('\r\n')
  return [body, remainder]
}

// Read email into a buffer
//
// Construct envelope
const cleanupEmail = (emailText) => {
//  console.log(d.source_email.body)
// make sure we have \r\n everyhwere -- needed for Envelope parser
  let modified = emailText.toString().replace(/\n/g, '\r\n')
  var email = new Envelope(modified)
  // Remove all CR/LF type things -- replace w/ spaces.
  console.log(email)
  let body = getBody(email['0'])[0].replace(/\r?\n|\r/g, ' ')
  //console.log( email )
  return ['Subject: '+email.header.subject, body].join('\r\n')
}

module.exports = function(Smartemail) {

  /** @param text Text to pass to NLU */
  const _enrichWithNLU = (text) => {
    let parameters = {
      text: '',
      features: {
        entities: {
          emotion: false,
          sentiment: false
        },
        relations: {}
      }
    }
    /*
    console.log('================ _enrichWithNLU() Inbound Message =================')
    console.log(text)
    console.log('================ _enrichWithNLU() End of Message ==================')
    */
    // Set the text to analyze
    const Settings = Smartemail.app.models.Settings
    const NLU = Smartemail.app.models.NLU

    // Replace CRLF/LF w/ Spaces...
//    parameters.text = text.replace(/\r?\n|\r/g, ' ')
     parameters.text = cleanupEmail(text)
    // Return a promise
    let modelId = null;
    let modelDate = null;
    return new Promise((resolve, reject) => {
      Settings.load((settingserr, settings) => {
        // If settings returned, we have a modelid, use it.
        if (settingserr) {
          console.error('Failed to load settings: ', settingserr)
          console.error('Failed to load settings: ', settings)
        }
        console.log('Settings! : ', settings)
        if (settings && settings.wksModelId && settings.wksModelId !== '') {
          modelId = settings.wksModelId
          modelDate = settings.wksModelDateTime
          parameters.features.entities.model = modelId
          parameters.features.relations.model = modelId
        }
        NLU.analyze(parameters, (err, response) => {
          //   console.log('Response from NLU!', response)
          let return_obj = {
            wks_model_id: modelId,
            wks_date_time: modelDate
          }
          if (err) {
            console.error('SmartEmail._enrichWithNLU() FAILED', err)
            if (err.message && err.message.code === 500 && err.message.error === 'Not Found') {
              err.message.error = `WKS Model Id (${settings.wksModelId}) Not Found`
            }
            return_obj.error = true
            return_obj.exception = 'NLU:' + err.message
            resolve(return_obj)
          } else {
            console.log('SmartEmail._enrichWithNLU() SUCCEEDED')
            return_obj.entities = response.entities
            return_obj.relations = response.relations
            return_obj._text = parameters.text
            resolve(return_obj)
          }
        })
      })
    })
  }

  Smartemail.categorize = function(msg, cb) {
    //    console.log('SmartEmail.categorize() Received this message:  ', msg)
    // Now we need to normalize msg.
    // Set the start time
    //      console.log('Accessible models? ', Smartemail.app.models.Discovery)
    // create new response message
    let app = Smartemail.app

    // Create a new message
    let newMessage = Object.assign({}, _discMessage)
    let text = msg.source_email.body

    if (msg.ground_truth) {
      newMessage.ground_truth = msg.ground_truth
    }

    if (msg.id) {
      newMessage.id = msg.id
      newMessage.source_id = msg.id
    }

    newMessage.start_date_time = Date.now()

    Promise.all([_categorize(msg), _enrichWithNLU(text)])
      .then(responses => {
        console.log('SmartEmail.categorize() Enrichment SUCCESS ' + newMessage.id)
        // Set the end_date_time
//        console.log('response[0]', responses[0])
        Object.assign(newMessage, responses[0])

        // Assing the the entities
        if (responses[1].error) {
          // It failed add the exceptions...
          newMessage.exception.push(responses[1].exception)
          newMessage.wks_model_id = responses[1].wks_model_id
          newMessage.wks_date_time = responses[1].wks_date_time
        } else {
          newMessage.entities_extracted = responses[1].entities
          newMessage.relations_extracted = responses[1].relations
          newMessage.wks_model_id = responses[1].wks_model_id
          newMessage.wks_date_time = responses[1].wks_date_time
          newMessage.text_for_enrichment = responses[1]._text
        }
        newMessage.end_date_time = Date.now()
        if (newMessage.exception.length === 0) {
          newMessage.successfully_processed = true
        }
        newMessage = confusionMatrix.populateConfusion(newMessage)
        newMessage.end_date_time = Date.now()
        // Add confusion info to it.
        console.log('SmartEmail.categorize() Message to store:' + newMessage.id)
        // Save the message in Cloudant
        //Smartemail.replaceOrCreate(newMessage, (err, createmsg) => {
        Smartemail.wslReplaceOrCreate(newMessage, (err, createmsg) => {
          if (err) {
            console.error('Categorize wslReplaceOrCreate failed... ' + newMessage.id, err)
            cb(err)
          } else {
            console.log('Categorize wslReplaceOrCreate SUCCESS ' + newMessage.id)
            cb(null, newMessage)
          }
        })
      })
      .catch(err => {
        console.error('Categorize failed... ' + newMessage.id, err)
        cb(err)
      })

    // Save it in Discovery...
    /*
    app.models.Discovery.add(newMessage, (err, createmsg) => {
      console.log('SmartEmail.categorize() Successfully Stored? ', createmsg)
      cb(err, createmsg)
    })
    */

    // Store in cloudant...
    /*
        Smartemail.create(response, (err, createmsg) => {
          console.log('Create finished, msg: ', createmsg)
          cb(err, response)
        })
      })
    */
  }

  Smartemail.wslReplaceOrCreate = function(msg, cb) {
    let method = Smartemail.create.bind(Smartemail)
    let logMessage = `wslReplaceOrCreate: ${msg.id} not found, creating...`
    if (msg.id) {
      console.log('wslReplaceOrCreate -- Starting... ' + msg.id)
      Smartemail.exists(msg.id, (err, result) => {
        console.log('Exists returned...', result)
        if (err) {
          console.log('wslReplaceOrCreate exists Error? ', err)
        }
        if (result) {
          logMessage = `wslReplaceOrCreate: ${msg.id} found, replacing...`
          method = Smartemail.upsert.bind(Smartemail)
        }
        console.log(logMessage)
        method(msg, (err, response) => {
          if (err) {
            console.error('wslReplaceOrCreate ERROR: ', err)
          }
          cb(err, msg)
        })
      })
    } else {
      cb('No message ID in message')
    }
  }

  Smartemail.save = function(msg, cb) {
    console.log('SmartEmail.save() Inbound message:  ', msg)
    // Now we need to normalize msg.
    // Set the start time
    //      console.log('Accessible models? ', Smartemail.app.models.Discovery)
    // create new response message
    let app = Smartemail.app
    let newMessage = Object.assign({}, _discMessage)

    if (msg.ground_truth) {
      newMessage.ground_truth = msg.ground_truth
    }
    if (msg.id) {
      newMessage.id = msg.id
    } else {
      newMessage.id = '__NO_ID'
    }
    newMessage.start_date_time = Date.now()
    // categorize only uses the source_email
    _categorize(msg)
      .then((response) => {
        console.log('SmartEmail.save() _categorize Result is:  ', response)
        // Set the end_date_time
        Object.assign(newMessage, response)
        console.log('SmartEmail.save() Storing message: ', newMessage)
        newMessage.end_date_time = Date.now()
        // Store in cloudant...
        /* Smartemail.create(response, (err, createmsg) => {
          console.log('Create finished, msg: ', createmsg)
          cb(err, response)
        })*/
        // Save it in Discovery...
        app.models.Discovery.save(newMessage, (err, createmsg) => {
          console.log('Adding to discovery response: : ', createmsg)
          cb(err, createmsg)
        })
      })
  }

  Smartemail.flatten = function(modelId) {
//    console.log('ModelID? ', modelId)
    return new Promise((resolve, reject) => {
      let filter = null;
      // It comes in this way when not set...
      if (modelId !== '{modelId}') {
        filter = {
          where: {
            wks_model_id: modelId
          }
        }
      }
      Smartemail.find(filter, (err, found) => {
        // calculate an object of ALL ENTITIES possible
        if (err) {
          reject(err)
        }
        console.log('Found: ', found.length)
        let entities = found.reduce((_entities, o) => {
          o.entities_extracted.forEach((e) => {
            _entities[e.type] = ''
          })
          if (o.ground_truth.extracted_entities) {
            o.ground_truth.extracted_entities.forEach((e) => {
              _entities[e.type] = ''
            })
          }
          return _entities
        }, {})
        // calculate an object of ALL Transaction Types possible
        let transaction_types = found.reduce((_tt, o) => {
          o.transaction_types.forEach((t) => {
            _tt[t.transaction_type] = ''
          })
          return _tt
        }, {})
        // relations

        let relation = found.reduce((_r, o) => {
          if (o.relations_extracted) {
            o.relations_extracted.forEach((r) => {
              let type = r.type
              let entity1 = r.arguments[0].entities[0].type
              let entity2 = r.arguments[1].entities[0].type
              _r[`${entity1},${type},${entity2}`] = ''
            })
          }
          return _r
        }, {})

        // Return a list in correct format
        let tt_array = Object.keys(transaction_types).sort()
        let e_array = Object.keys(entities).sort()
        let r_array = Object.keys(relation).reduce((r, c) => {
          r = r.concat(c.split(','))
          return r
        },[])
        // Build the header...
        let header = '"ID",' + tt_array.map(tt => `"${tt}"`).join() + ',' + e_array.map(e => `"${e}"`).join(',') + ',' + r_array.map(r => `"${r}"`).join(',')
        let flatList = found.map((item) => {
          let csv = [item.source_id]
          tt_array.forEach((tt) => {
            csv.push('"' + item.transaction_types.filter((t) => {
              return (t.transaction_type === tt)
            }).map((t) => {
              // The list of matches
              return t.confidence_level
            }).join(':::') + '"')
          })
          e_array.forEach((entity) => {
            csv.push('"' + item.entities_extracted.filter((e) => {
              return (e.type === entity)
            }).map((e) => {
              // The list of matches
              return e.text
            }).join(':::') + '"')
          })
          Object.keys(relation).forEach((rel) => {
            let [left, type, right] = rel.split(',')
            console.log(`Searching for ${left} - ${type} - ${right}`)
            if (item.relations_extracted) {
              item.relations_extracted.filter((_rel) => {
                return ( _rel.type === type &&
                  _rel.arguments[0].entities[0].type === left &&
                  _rel.arguments[1].entities[0].type === right )
              }).map((_r) => {
                // The list of matches
                console.log(`Found ${_r.arguments[0].entities[0].text} -  ${_r.type} -  ${_r.arguments[1].entities[0].text}`)
                csv.push(_r.arguments[0].entities[0].text)
                csv.push(_r.type)
                csv.push( _r.arguments[1].entities[0].text)
              })
            } else {
              console.log('!!!!!!!!!! No Relationships Found !!!!!!!!!!!!!!!')
              csv.push('')
              csv.push('')
              csv.push('')
            }
          })
          return csv.join(',')
        })
        flatList.unshift(header)
        resolve(flatList)
      })
    })
  }

    Smartemail.flattentoc = function(modelId) {
      console.log('ModelID? ', modelId)

      return new Promise((resolve, reject) => {
        let filter = null;
        // It comes in this way when not set...
        if (modelId !== '{modelId}') {
          filter = {
            where: {
              wks_model_id: modelId
            }
          }
        }

        Smartemail.find(filter, (err, found) => {
          // calculate an object of ALL ENTITIES possible
          if (err) {
            reject(err)
          }
          console.log('Found: ', found.length)
          let entities = found.reduce((_entities, o) => {
            o.entities_extracted.forEach((e) => {
              _entities[e.type] = ''
            })
            if (o.ground_truth.extracted_entities) {
              o.ground_truth.extracted_entities.forEach((e) => {
                _entities[e.type] = ''
              })
            }
            return _entities
          }, {})

          // calculate an object of ALL Transaction Types possible
          let transaction_types = found.reduce((_tt, o) => {
            o.transaction_types.forEach((t) => {
              _tt[t.transaction_type] = ''
            })
            return _tt
          }, {})
          // Return a list in correct format
          let tt_array = Object.keys(transaction_types).sort()
          let e_array = Object.keys(entities).sort()
          let header = '"ID",' + tt_array.map(tt => `"${tt}"`).join() + ',' + e_array.map(e => `"${e}"`).join(',')
          let flatList = found.map((r) => {
            let csv = [r.source_id]
            tt_array.forEach((tt) => {
              csv.push('"' + r.transaction_types.filter((t) => {
                return (t.transaction_type === tt)
              }).map((t) => {
                // The list of matches
                return t.confidence_level
              }).join(':::') + '"')
            })
            e_array.forEach((entity) => {
              csv.push('"' + r.entities_extracted.filter((e) => {
                return (e.type === entity)
              }).map((e) => {
                // The list of matches
                return e.text
              }).join(':::') + '"')
            })
            return csv.join(',')
          })
          flatList.unshift(header)
          resolve(flatList)
        })
      })
    }

  Smartemail.flattoc = function(modelId, res, cb) {
    console.log('flattoc: ', modelId)
    Smartemail.flattentoc(modelId)
      .then((list) => {
//        console.log('Flatten returned list: ', list)
        var datetime = new Date();
        res.set('Expires', 'Tue, 03 Jul 2001 06:00:00 GMT');
        res.set('Cache-Control', 'max-age=0, no-cache, must-revalidate, proxy-revalidate');
        res.set('Last-Modified', datetime + 'GMT');
        res.set('Content-Type', 'application/force-download');
        res.set('Content-Type', 'application/octet-stream');
        res.set('Content-Type', 'application/download');
        res.set('Content-Disposition', 'attachment;filename=Data.csv');
        res.set('Content-Transfer-Encoding', 'binary');
        res.send(list.join('\r\n')); //@todo: insert your CSV data here.
      })
  }

  Smartemail.flatList = function(modelId, res, cb) {
    console.log('flatList: ', modelId)
    Smartemail.flatten(modelId)
      .then((list) => {
//        console.log('Flatten returned list: ', list)
        var datetime = new Date();
        res.set('Expires', 'Tue, 03 Jul 2001 06:00:00 GMT');
        res.set('Cache-Control', 'max-age=0, no-cache, must-revalidate, proxy-revalidate');
        res.set('Last-Modified', datetime + 'GMT');
        res.set('Content-Type', 'application/force-download');
        res.set('Content-Type', 'application/octet-stream');
        res.set('Content-Type', 'application/download');
        res.set('Content-Disposition', 'attachment;filename=Data.csv');
        res.set('Content-Transfer-Encoding', 'binary');
        res.send(list.join('\r\n')); //@todo: insert your CSV data here.
      })
  }

  Smartemail.remoteMethod('categorize', {
    accepts: [{
      arg: 'data',
      type: 'object',
      http: {
        source: 'body'
      }
    }],
    description: 'Given an inbound JSON document, pass to Message-Classifier MicroService and then through NLU.  Store in DB, returns JSON stored',
    returns: {
      root: true,
      type: 'object'
    }
  })

  Smartemail.remoteMethod('wslReplaceOrCreate', {
    accepts: [{
      arg: 'data',
      type: 'object',
      http: {
        source: 'body'
      }
    }],
    description: 'Given an inbound JSON document, replace if exists, create if it does not',
    returns: {
      root: true,
      type: 'object'
    }
  })

  Smartemail.remoteMethod('save', {
    accepts: [{
      arg: 'data',
      type: 'object',
      http: {
        source: 'body'
      }
    }],
    returns: {
      root: true,
      type: 'object'
    }
  })

  Smartemail.remoteMethod('flatList', {
    accepts: [{
        arg: 'modelId',
        type: 'string'
      },
      {
        arg: 'res',
        type: 'object',
        'http': {
          source: 'res'
        }
      }
    ],
    http: {
      path: '/flatList/:modelId',
      verb: 'get'
    },
    returns: {}
  })
};
