'use strict';
const watson = require('watson-developer-cloud')
const request = require('request')
// Add the content to the Discovery Service


const discoveryConfig = {
  username: process.env.DISCOVERY_API_USER,
  password: process.env.DISCOVERY_API_PASSWORD,
  version_date: '2016-12-01'
}

const defaultOptions = {
  environment_id: process.env.DISCOVERY_API_ENV_ID,
  collection_id: process.env.DISCOVERY_API_COLLECTION_ID
}

console.log('discoveryConfig: ', discoveryConfig)
console.log('defaultOptions: ', defaultOptions)

const discovery = new watson.DiscoveryV1(discoveryConfig)

// Check on the document status in discovery
const checkDocumentStatus = (documentId, cb) => {
  return new Promise((resolve, reject) => {
    var options = {
      url: process.env.DISCOVERY_API_URL +
        '/v1/environments/' + process.env.DISCOVERY_API_ENV_ID +
        '/collections/' + process.env.DISCOVERY_API_COLLECTION_ID +
        '/documents/' + documentId +
        '?version=2016-12-01',
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json'
      },
      auth: {
        user: process.env.DISCOVERY_API_USER,
        password: process.env.DISCOVERY_API_PASSWORD
      }
    }
    request(options, (err, response, status) => {
      try {
        if (err) {
          reject(err)
        } else {
          if (response.statusCode !== 200) {
            reject('HTTP Error code returned from Discovery: ' + response.statusCode)
          } else {
            resolve(status)
          }
        }
      } catch (err) {
        reject(err)
      }
    })
  })
}
const pollStatus = (id) => {
  //  This is a promise
  return poll((id, cb) => {
    // This function we are defining gets called until true or timeout
    checkDocumentStatus(id)
      .then((status) => {
        console.log('pollStatus - checkDocumentStatus ' + status.document_id + ' = ' + status.status)
        if (status.status === 'failed') {
          console.log(JSON.stringify(status, null, 2))
        }
        cb(status.status === 'available' || status.status === 'failed')
      }, (err) => {
        console.log('Error returned from WDS status check for id ' + id + ' : ' + err)
        cb(false)
      })
  }, id, 5000, 1000)
}

// The polling function
const poll = (fn, id, timeout, interval) => {
  var endTime = Number(new Date()) + (timeout || 2000)
  interval = interval || 100
  var checkCondition = (resolve, reject) => {
    // If the condition is met, we're done!
    fn(id, (result) => {
      if (result) {
        resolve({
          'id': id,
          status: result
        })
      } else {
        // If the condition isn't met but the timeout hasn't elapsed, go again
        if (Number(new Date()) < endTime) {
          setTimeout(checkCondition, interval, resolve, reject)
        } else {
          // Didn't match and too much time, reject!
          resolve({
            'error': 'Timeout',
            'id': id
          })
        }
      }
    })
  }
  return new Promise(checkCondition)
}

const replaceDocument = (discId, doc, done) => {
  // Create doc correctly.
  console.log('discovery.replaceDocument: '+discId)
  if (doc.id) {
    doc.source_id = doc.id
    delete doc.id
  }
  return deleteDocument(discId)
    .then((result) => {
      return addDocument(doc)
    })
}

// Add a document
const updateDocument = (discId, doc, done) => {
  return new Promise((resolve, reject) => {
    // Make a copy of the doc that will be returned
    // Create a Javascript Date object for Discovery to use in time series queries
    let url = process.env.DISCOVERY_API_URL +
      '/v1/environments/' + process.env.DISCOVERY_API_ENV_ID +
      '/collections/' + process.env.DISCOVERY_API_COLLECTION_ID +
      '/documents/' + discId +
      '?version=2016-12-01'
    if (doc.id) {
      doc.source_id = doc.id
      delete doc.id
    }
    let req = request.post(url, (err, httpResponse, body) => {
      if (err) {
        console.log(err)
        /*
        setTimeout(function () {
          resolve(copy)
        }, 30000)
        */
        reject(err)
      } else {
        // Add wds_id to document
        resolve(JSON.parse(body).document_id)
      }
    }).auth(process.env.DISCOVERY_API_USER, process.env.DISCOVERY_API_PASSWORD)
    var form = req.form()
    form.append('file', Buffer.from(JSON.stringify(doc), 'utf8'), {
      filename: doc.id + '.json',
      contentType: 'application/json'
    })
  })
}

// Add a document
const deleteDocument = (discId, done) => {
  return new Promise((resolve, reject) => {
    // Make a copy of the doc that will be returned
    // Create a Javascript Date object for Discovery to use in time series queries
    let url = process.env.DISCOVERY_API_URL +
      '/v1/environments/' + process.env.DISCOVERY_API_ENV_ID +
      '/collections/' + process.env.DISCOVERY_API_COLLECTION_ID +
      '/documents/' + discId +
      '?version=2016-12-01'
    let req = request.delete(url, (err, httpResponse, body) => {
      if (err) {
        console.log(err)
        /*
        setTimeout(function () {
          resolve(copy)
        }, 30000)
        */
        reject(err)
      } else {
        // Add wds_id to document
        resolve(JSON.parse(body).status)
      }
    }).auth(process.env.DISCOVERY_API_USER, process.env.DISCOVERY_API_PASSWORD)
  })
}

// Add a document
const addDocument = (doc, done) => {
  return new Promise((resolve, reject) => {
    // Make a copy of the doc that will be returned
    // Create a Javascript Date object for Discovery to use in time series queries
    let url = process.env.DISCOVERY_API_URL +
      '/v1/environments/' + process.env.DISCOVERY_API_ENV_ID +
      '/collections/' + process.env.DISCOVERY_API_COLLECTION_ID +
      '/documents?version=2016-12-01'

    if (doc.id) {
      doc.source_id = doc.id
      delete doc.id
    }
    let req = request.post(url, (err, httpResponse, body) => {
      if (err) {
        console.log(err)
        /*
        setTimeout(function () {
          resolve(copy)
        }, 30000)
        */
        reject(err)
      } else {
        // Add wds_id to document
        resolve(JSON.parse(body).document_id)
      }
    }).auth(process.env.DISCOVERY_API_USER, process.env.DISCOVERY_API_PASSWORD)
    var form = req.form()
    form.append('file', Buffer.from(JSON.stringify(doc), 'utf8'), {
      filename: doc.id + '.json',
      contentType: 'application/json'
    })
  })
}

let getDocumentBySourceId = (id) => {
  let params = {}
  // copy defaults
  Object.assign(params, defaultOptions)
  // add query:
  console.log(`Trying to get Document by Source_id: ${id}`)
  params.query = `source_id:${id}`
  return new Promise((resolve, reject) => {
    try {
      discovery.query(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          console.log('getDocumentBySourceId: response... ', data)
          if (data.results) {
            if (data.results.length > 1) {
              // Too Many...
              console.error('Too many results, only returning first one.')
            }
            resolve(data.results[0])
          } else {
            // resolve empty or null?
            resolve({})
          }
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

let getDocumentById = (id) => {
  let params = {}
  // copy defaults
  Object.assign(params, defaultOptions)
  // add query:
  console.log(`getDocumentById: Looking up Document ${id}`)
  params.query = `_id:${id}`
  return new Promise((resolve, reject) => {
    try {
      discovery.query(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.results[0])
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

let getAllDocuments = () => {
  let params = {}
  // copy defaults
  Object.assign(params, defaultOptions)
  // add query:
  params.query = ''
  params.count=1000
  return new Promise((resolve, reject) => {
    try {
      discovery.query(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.results)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = (Discovery) => {
  Discovery.add = (msg, cb) => {
    console.log('Discovery.add -- message.id:  ', msg.id)
    // Now we need to normalize msg.
    // Set the start time
    //    msg.start_date_time = Date.now()
    // Use the msg.id (later mapped to source_id if accurate)
    getDocumentBySourceId(msg.id)
      .then((result) => {
        if (result && result.id && result.source_id) {
          // We found one...
          // Update it instead...
          // Result.id is the Discovery DOC ID...
          console.log(`Found doc: ${result.id}, replacing...`)
          return replaceDocument(result.id, msg)
        } else {
          // Add it...
          console.log(`Adding Doc ${msg.id} updating...`)
          return addDocument(msg)
        }
      })
      .then((id) => {
        console.log('Added Document! id: ', id)
        // Set the end_date_time
        //        msg.end_date_time = Date.now()
        return pollStatus(id)
      }).then((status) => {
        if (status.error) {
          throw new Error(status.error)
        }
        console.log('Polling Status finished... resolving: ', status)
        return Promise.resolve(status.id)
      }).then((id) => {
        return getDocumentById(id)
      }).then((response) => {
        cb(null, response)
      }).catch((err) => {
        cb(err)
      })
  }

  Discovery.save = (doc, cb) => {
    addDocument(doc).then((response) => {
      //      console.log('Deleted!', response)
      cb(null, response)
    }).catch((err) => {
      cb(err)
    })

  }

  Discovery.delete = (id, cb) => {
    deleteDocument(id).then((response) => {
      //      console.log('Deleted!', response)
      cb(null, response)
    }).catch((err) => {
      cb(err)
    })
  }

  Discovery.document_id = (id, cb) => {
    getDocumentById(id).then((response) => {
//      console.log('BODY!', response)
      cb(null, response)
    }).catch((err) => {
      cb(err)
    })
  }

  Discovery.source_id = (id, cb) => {
    getDocumentBySourceId(id).then((response) => {
 //     console.log('BODY!', response)
      cb(null, response)
    }).catch((err) => {
      cb(err)
    })
  }

  Discovery.documents = (cb) => {
    getAllDocuments().then((response) => {
      cb(null, response)
    }).catch((err) => {
      cb(err)
    })
  }

  Discovery.remoteMethod('save', {
    accepts: [{
      arg: 'data',
      type: 'object',
      http: {
        source: 'body'
      }
    }],
    returns: {
      arg: 'data',
      type: 'object'
    }
  })

  Discovery.remoteMethod('add', {
    accepts: [{
      arg: 'data',
      type: 'object',
      http: {
        source: 'body'
      }
    }],
    returns: {
      arg: 'data',
      type: 'object'
    }
  })

  Discovery.remoteMethod('documents', {
    http: {
      source: 'req',
      path: '/documents',
      verb: 'get'
    },
    description: 'get All documents',
    returns: {
      root: true,
      type: 'object'
    }
  })


  Discovery.remoteMethod('delete', {
    http: {
      source: 'req',
      path: '/delete/:id',
      verb: 'delete'
    },
    description: 'Delete document by document ID (Internal Discovery ID)',
    accepts: [{
      arg: 'id',
      type: 'string'
    }],
    returns: {
      root: true,
      type: 'object'
    }
  })

  Discovery.remoteMethod('document_id', {
    http: {
      source: 'req',
      path: '/document_id/:id',
      verb: 'get'
    },
    description: 'Lookup document by document ID (Internal Discovery ID)',
    accepts: [{
      arg: 'id',
      type: 'string'
    }],
    returns: {
      root: true,
      type: 'object'
    }
  })

  Discovery.remoteMethod('source_id', {
    http: {
      path: '/source_id/:id',
      verb: 'get'
    },
    description: 'Lookup document by source_id (id set in source material)',
    accepts: [{
      arg: 'id',
      type: 'string'
    }],
    returns: {
      root: true,
      type: 'object'
    }
  })
}
