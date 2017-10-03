'use strict'
const fs = require('fs');
const request = require('request')
const confusionMatrix = require('./utils/confusion-matrix')
const Envelope = require('envelope')
const certholderUtils = require('./utils/certholderUtils.js')

let _discMessage = {
  id: '',
  source_id: '',
  source_email: {
    body: '',
    subject: '',
    cleansed: ''
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
      console.log("trying to  categorize email")
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

///******** SHOULD BE ABLE TO REMOVE - refactored into ./utils/email-cleanup-utils.js ****** //
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
///******** SHOULD BE ABLE TO REMOVE ABOVE - refactored into ./utils/email-cleanup-utils.js ****** //
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
     //parameters.text = cleanupEmail(text)
     parameters.text = text;
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
    let text = msg.source_email.cleansed
    console.log(text)
    if (msg.ground_truth) {
      newMessage.ground_truth = msg.ground_truth
    }

    if (msg.id) {
      newMessage.id = msg.id
      newMessage.source_id = msg.id
    }
    if (msg.is_blind_email) {
      newMessage.is_blind_email = msg.is_blind_email;
    }

    newMessage.start_date_time = Date.now()

    // TODO: put _categorize back in. not necessary now bc only using COI
    Promise.all([_enrichWithNLU(text),_categorize(msg) ])
      .then(responses => {
        console.log('SmartEmail.categorize() NLU and _categorize completed ' + newMessage.id)
        // Set the end_date_time
//        console.log('response[0]', responses[0])

        // add conversation response to object
        Object.assign(newMessage, responses[1])

        // Assing the the entities
        if (responses[0].error) {
          // It failed add the exceptions...
          newMessage.exception.push(responses[0].exception)
          newMessage.wks_model_id = responses[0].wks_model_id
          newMessage.wks_date_time = responses[0].wks_date_time
        } else {
          newMessage.source_email = msg.source_email
          console.log("NEW MESSAGE SOURCE EMAIL")
          console.log(newMessage.source_email)
          newMessage.entities_extracted = responses[0].entities
          console.log("NEW MESSAGE ENTITIES")
          console.log(newMessage.entities_extracted)
          newMessage.relations_extracted = responses[0].relations
          console.log("NEW MESSAGE RELATIONS")
          console.log(newMessage.relations_extracted)
          newMessage.wks_model_id = responses[0].wks_model_id
          newMessage.wks_date_time = responses[0].wks_date_time
          newMessage.text_for_enrichment = responses[0]._text
          let relation_data= certholderUtils.create_entities_relations(newMessage.entities_extracted, newMessage.relations_extracted, newMessage.source_id)
          newMessage.relation_data = relation_data

          // begin writing to output
          let testOutputString = "";
          testOutputString += "Email ID: " + newMessage.id + " \n";
          testOutputString += "----------------Begin Cleansed ---------------------------------: \n" + newMessage.source_email.cleansed + " \n----------------End Cleansed ---------------------------------:: \n\n";

          testOutputString += "----------------Begin Relation Info ---------------------------------: \n"
          testOutputString += "\n\nRelations chains starting from COI_FormType_COI \n"
          testOutputString += JSON.stringify(newMessage.relation_data.certholder_dfs, null, 2)
          testOutputString += "\n\nRelations chains starting from Company_Name \n"
          testOutputString += JSON.stringify(newMessage.relation_data.companies_dfs, null, 2)
          testOutputString += "\n\nRelations chains starting from Street Address \n"
          testOutputString += JSON.stringify(newMessage.relation_data.street_addresses_dfs, null, 2)
          testOutputString += "\n\nEntities found \n"
          testOutputString += JSON.stringify(newMessage.relation_data.entities, null, 2)
          testOutputString += "\n\nRelations Found found \n"
          testOutputString += JSON.stringify(newMessage.relation_data.relations, null, 2)
          testOutputString += " \n----------------End Relation Info ---------------------------------:: \n\n";
          // testOutputString += "Relations with types structured ******>>>>>: \n " + newMessage.structured_entities_relations.join("\n") +" \n\n\n";


          testOutputString += "----------------Begin Source ---------------------------------: \n" + newMessage.source_email.body + " \n----------------End Source ---------------------------------:: \n\n";

          fs.writeFile("./output/"+newMessage.id, testOutputString, function(err) {
              if(err) {
                  return console.log(err);
              }

              console.log("Saved file to " + "./output/"+newMessage.id);
          });
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
        // look at the entities extracted, as well as the ground truth entities
        // this is accross ALL emails in database
        if (err) {
          reject(err)
        }
        console.log('Found: ', found.length)
        // log the JSON result of the search to better understand the find mechanism
        var fs = require('fs');
        fs.writeFile(".found.json", JSON.stringify(found), function(err) {
          if(err) {
            return console.log(err);
          }
          console.log("The file was saved!");
        });
        // found returns an array of each of the emails stored in the cloudant

        let entities = found.reduce((_entities, o) => { // reduce = fold
          o.entities_extracted.forEach((e) => { //
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
        // question - why do you not look at ground truth as well??
        // answer: categorize service returns confidences on all no matter what.
        let transaction_types = found.reduce((_tt, o) => {
          o.transaction_types.forEach((t) => {
            _tt[t.transaction_type] = ''
          })
          return _tt
        }, {})

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

        // build the rows, item is the email object
        let flatList = found.map((item) => {
          let csv = [item.source_id] // first element of
          tt_array.forEach((tt) => {
            csv.push('"' + item.transaction_types.filter((t) => {
              return (t.transaction_type === tt)
            }).map((t) => {
              // The list of matches
              return t.confidence_level
            }).join(':::') + '"') // add the confidence level for each transaction type.
          })                      // only one instance for each transaction type returned, so the join(':::') is never actuall called
          e_array.forEach((entity) => {
            csv.push('"' + item.entities_extracted.filter((e) => {
              return (e.type === entity)
            }).map((e) => {
              // The list of matches
              return e.text
            }).join(':::') + '"')
          })
          Object.keys(relation).forEach((rel) => {
            let [left, type, right] = rel.split(',') // parse relation back out
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
        flatList.unshift(header) // put the header at the top of the flat list
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

  Smartemail.pocOutput = function(modelId) {
  //    console.log('ModelID? ', modelId)
    return new Promise((resolve, reject) => {
      let filter = null;
      // It comes in this way when not set...
      if (modelId !== '{modelId}') {
        filter = {
          //where: {and: [{wks_model_id: modelId}, {is_blind_email: true}]}
          // where: {
          //   wks_model_id: modelId,
          // }
          where: {
            "is_blind_email": true,
          }
        }
      }

      Smartemail.find(filter, (err, found) => {

      // uncomment following two lines when looking at specific emails
      // Smartemail.findById(1553,filter, (err, object) => {
      //   let found = [object]
        // calculate an object of ALL ENTITIES possible
        // look at the entities extracted, as well as the ground truth entities
        // this is accross ALL emails in database
        if (err) {
          reject(err)
        }

        console.log('Found records: ', found.length)
        // found returns an array of each of the emails stored in the cloudant
        const removePunctuation = (s) => {
          // let punctuationless = s.replace(/[.,\/!$%\^&\*;:{}=\-_`~()]/g,"");
          let punctuationless = s.replace(/[,]/g,"");
          punctuationless = punctuationless.replace("\n","");
          let finalString = punctuationless.replace(/\s{2,}/g," ");
          return finalString;
        }

        const isCompleteFullAddress = (elements) => {
          if (elements.length == 5) {
            return (elements[0].type == 'Company_Name' && elements[1].type == 'Address_StreetNumber'
                    && elements[2].type == 'Address_City' && elements[3].type == 'Address_State'
                    && elements[4].type == 'Address_ZIP')
          }
          return false;
        }

        const buildCompanyAddressString = (elements) => { // TODO: make this more elegant
          let string_builder = ""
          for (let el of elements) {
            // console.log(el)
            string_builder += el.text + " "
          }
          return string_builder;
        }
        // Return a list in correct format
        let header = '"ID", OUTPUT_STRING'
        let csv_rows = []
        csv_rows.push(header)
        let best_string = ""
        for (let found_email of found) {
          let strings = []
          let relation_data = found_email.relation_data
          //console.log(relation_data)
          //console.log('just tried to find ID' + id)
          // first, go for the "easy scenario" - certholder chain of length = 6
          if (relation_data && relation_data.hasOwnProperty('certholder_dfs')) {
            for (let certholder_dfs_element of relation_data['certholder_dfs']) {
              // console.log(certholder_dfs_element['simpleString'])
              if (certholder_dfs_element['elements'].length == 6) {

                let first_six_elems = certholder_dfs_element['elements'].slice(1,6)
                // console.log(JSON.stringify(first_six_elems, null, 4))
                let sb = buildCompanyAddressString(first_six_elems)
                // let string_builder = ""
                // for (let el of first_six_elems) {
                //   // console.log(el)
                //   string_builder += el.text + " "
                // }
                // console.log("found one of length 6 or greated")
                strings.push(removePunctuation(sb))
              }
              //TODO: code will break if element chain such as cert -> company with incomplete_address -> company with complete address
              //      should fix.
              if (certholder_dfs_element['elements'].length > 6) {
                console.log("email id: " + found_email.source_id + " found with length greater than 6")
                console.log(certholder_dfs_element['elements'].length + " elements")
                console.log(found_email.source_id + "\n" + certholder_dfs_element['simpleString'])
                for(let i = 0; i < (certholder_dfs_element['elements'].length - 1)/5; i++) {
                  console.log("i is: " + i)
                  let sub_elements = certholder_dfs_element['elements'].slice(1+i*5, (i+1)*5 + 1)
                  if (isCompleteFullAddress(sub_elements)) {
                    strings.push(removePunctuation(buildCompanyAddressString(sub_elements)))
                  }
                }
              }
            }
          }

          // medium scenario - in one spot indicated certholder. in another, indicated the address of the certholder
          // let's test if we can merge certholder - company with address - company
          // first, let's find all certholder-company relations. assuming if they went longer than two
          // that there would have been a complete address chain
          if (strings.length > 0) {
            let certholder_companies = []
            if (relation_data && relation_data.hasOwnProperty('certholder_dfs')) {
              for (let pot_certholder_company_pair of relation_data['certholder_dfs']) {
                if (pot_certholder_company_pair['elements'].length == 2) {
                  // console.log("found a pair of length 2")
                  // console.log(JSON.stringify(pot_certholder_company_pair, null, 2));
                  // console.log(pot_certholder_company_pair['elements'][1]['type'] == 'Company_Name')
                  if (pot_certholder_company_pair['elements'][1]['type'] == 'Company_Name') {
                    // console.log('evaluated to true')
                    //console.log(pot_certholder_company_pair['elements'][1]['text'])
                    certholder_companies.push(pot_certholder_company_pair['elements'][1]['text'])
                  }
                }
              }
            }
            // console.log("CERTHOLDER COMPANIES ARE: \n")
            // console.log(certholder_companies)
            // now, we need to find company-address chains of length 5, that also have the same company name as the potential pair from above
            if (strings.length == 0) {
              if (certholder_companies.length > 0 && relation_data && relation_data.hasOwnProperty('companies_dfs')) {
                // console.log("now going to search for a compatible company chain")
                // console.log(JSON.stringify(relation_data['companies_dfs'], null, 2))
                for (let company_dfs_element of relation_data['companies_dfs']) { // each of the companies dfs
                  // console.log("company_dfs_element")
                  //TODO: substitute function `isCompleteFullAddress` for the length
                  if (company_dfs_element['elements'].length == 5)  {// need complete from company
                    // console.log("found a company chain of length 5")
                    // console.log(company_dfs_element['elements'])
                    for (let certholder_company of certholder_companies) {
                      let company_name_cleaned = certholder_company.toLowerCase().trim()
                      let company_chain_name_cleaned = company_dfs_element['elements'][0]['text'].toLowerCase().trim()
                      // console.log("COmpany name " + company_name_cleaned)
                      // console.log("compared to " + company_chain_name_cleaned)
                      if (company_chain_name_cleaned.indexOf(company_name_cleaned) >= 0) {
                        // if the "certholder company" matches the company in the complete relationship
                        console.log("think we have found a merger")
                        console.log("company name is: " + company_name_cleaned)
                        console.log("company chain from DFS is: " + company_dfs_element['simpleString'])
                        strings.push("__Certholder: " + removePunctuation(company_dfs_element['simpleString']))
                      }
                    }
                  }
                }
              }
            }
          }
          // still no string - remaining company as certholder
          if (strings.length == 0) {
            if (relation_data && relation_data.hasOwnProperty('companies_dfs')) {
              for (let company_dfs_element of relation_data['companies_dfs']) {
                if (company_dfs_element['elements'].length == 5) {
                  // console.log("final method - assuming remaining company with full address is the certholder")
                  // console.log(found_email.source_id + ": "+ company_dfs_element['simpleString'])
                  strings.push(company_dfs_element['simpleString'])
                }
              }
            }
          }
          if (strings.length > 0) { // if we found
            strings = [ ...new Set(strings) ]
            best_string = strings.join(" | ")
          } else {
            best_string = "--"
          }
          // console.log(best_string)
          let csv_row = [found_email.source_id,'"'+best_string+'"']
          // console.log(csv_row)
          csv_rows.push(csv_row)
        }
        console.log(csv_rows.length)
        resolve(csv_rows)
      })
    })
  }
  Smartemail.pocOutputCsv = function(modelId, res, cb) {
    console.log('pocOutputCsv for model_id: ', modelId)
    Smartemail.pocOutput(modelId)
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
  Smartemail.remoteMethod('pocOutputCsv', {
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
    description: 'Given a model id, returns a CSV of the final output',
    http: {
      path: '/pocOutputCsv/:modelId',
      verb: 'get'
    },
    returns: {}
  });

};
