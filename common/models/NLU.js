'use strict'
module.exports = function (NLU) {
  NLU.disableRemoteMethod('invoke', true);
}
