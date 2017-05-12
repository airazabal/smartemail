'use strict';

const request = require('request')

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
        message.exception = ['Categorize '+ body]
      }
      resolve(message)
    })
  })
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
    parameters.text = text.replace(/\r?\n|\r/g, ' ')
    // Return a promise
    return new Promise((resolve, reject) => {
      Settings.load((settingserr, settings) => {
        // If settings returned, we have a modelid, use it.
        if (settingserr) {
          console.error('Failed to load settings: ', settingserr)
          console.error('Failed to load settings: ', settings)
        }
        console.log('Settings! : ', settings)
        if (settings && settings.wksModelId && settings.wksModelId !== '') {
          parameters.features.entities.model = settings.wksModelId
          parameters.features.relations.model = settings.wksModelId
        }
        NLU.analyze(parameters, (err, response) => {
          //   console.log('Response from NLU!', response)
          let return_obj = {
            wks_model_id: settings.wksModelId,
            wks_date_time: settings.wksModelDateTime
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
          newMessage.wks_model_id = responses[1].wks_model_id
          newMessage.wks_date_time = responses[1].wks_date_time
          newMessage.text_for_enrichment = responses[1]._text
        }
        newMessage.end_date_time = Date.now()
        if (newMessage.exception.length === 0) {
          newMessage.successfully_processed = true
        }
        newMessage.end_date_time = Date.now()
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
};
