var request = require('request'),
  session = require('../session-data'),
  utils = require('../utils');

/**
 * @param {String} filePath Path to file without URL
 * @param {String} newFilePath path to copy
 * @param {Object} [additionalHeaders]
 * @param {Boolean} [isPut] if true - XPUT will be used, otherwise XCOPY
 * @param {Function} callback
 */
module.exports = function(filePath, newFilePath, additionalHeaders, isPut, callback) {
  var req;
  if (isPut) {
    req = {
      url: session.xUrl + newFilePath,
      method: 'PUT',
      headers: {
        'Content-Length': 0,
        'X-Auth-Token': session.authToken,
        'X-Copy-From': filePath.indexOf('/', 0) === 0 ? filePath : '/' + filePath
      }
    };
  } else {
    req = {
      url: session.xUrl + filePath,
      method: 'COPY',
      headers: {
        'X-Auth-Token': session.authToken,
        'Destination': newFilePath.indexOf('/', 0) === 0 ? newFilePath : '/' + newFilePath
      }
    };
    additionalHeaders && utils.copyHeaders(req, additionalHeaders);
  }
  request(req,
    function(err, data) {
      if (err || !data) {
        callback(err, {success: false});
      } else {
        if (data.statusCode == 201) {
          callback(null, {success: true});
        } else {
          callback(null, {
            success: false,
            selectelMessage: data.body
          });
        }
      }
    });
};
