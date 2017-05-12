'use strict'
module.exports = function (Settings) {
  // We have 1 settings object we save...
  const settingsId = 'MasterSettings'
  const defaultSettings = {
    id : settingsId,
    wksModelId: '',
    wksModelDateTime: ''
  }

  Settings.load = function load (cb) {
    Settings.exists(settingsId, (err, result) => {
      if (err) {
        console.log('Settings.load() failed on exists...')
      }
      if (result) {
        // result is false, (doesn't exist, then...)
        Settings.findById(settingsId, cb)
      } else {
        Settings.create(defaultSettings, cb)
      }
    })
  }

  Settings.save = function save (doc, cb) {
    // Reset the ID...
    // default method is upsert, changes if settingsId doesn't exist
    let method = Settings.upsert.bind(Settings)
    let logMessage = `Settings.save(): Updating...`
    if (doc) {
      doc.id = settingsId
      doc.wksModelDateTime = Date.now()
    }
    Settings.exists(settingsId, (err, result) => {
      if (err) {
        console.log('Settings.save() failed on exists...')
      }
      if (!result) {
        // result is false, (doesn't exist, then...)
        method = Settings.create.bind(Settings)
        logMessage = `Settings.save(): Creating...`
      }
      console.log(logMessage)
      method(doc, cb)
    })
  }

  Settings.remoteMethod('load', {
    http: {
      verb: 'get'
    },
    returns: {
      root: true,
      type: 'object'
    }
  })

  Settings.remoteMethod('save', {
    http: {
      verb: 'put'
    },
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

}
