/**
 * Created by justlogin on 10/21/14.
 */

var request = require('request'),
  async = require('async'),
  fs = require('fs'),
  utils = require('../utils'),
  session = require('../session-data');


/**
 * Uploads file to the storage. If additional headers are needed, the can be passed with 'additionalHeaders' parameter.
 * @param {String} fullLocalPath
 * @param {String} hostingPath path without URL
 * @param {String} [archive]
 * @param {Function} callback
 */
module.exports = function (fullLocalPath, hostingPath, archive, callback) {
	if (typeof archive  === 'function') {
		callback = archive;
		archive = null;
	}
	if (archive) {
		hostingPath += '?extract-archive=' + archive;
	}
  async.waterfall(
    [
      function(wfCb) {
        fs.readFile(fullLocalPath, wfCb);
      },
      function(file, wfCb) {
        var req = {
          url: session.xUrl + hostingPath,
          method: 'PUT',
          headers: {
            'X-Auth-Token': session.authToken,
            'Content-Length': fs.statSync(fullLocalPath).size
          },
          body: file
        };

        request(req, wfCb);
      }
    ],
    function(err, data) {
      if (err || !data) {
        callback(err, {success: false});
      } else {
        if (data.statusCode == 201 || data.statusCode == 200) {
          callback(null, {success: true});
        } else {
          callback(null, {
            success: false,
            selectelMessage: data.body
          });
        }
      }
    }
  );
};
