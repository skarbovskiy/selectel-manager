
var request = require('request'),
  utils = require('../utils'),
  session = require('../session-data');


module.exports = function(files, callback) {
  var req = {
    url: session.xUrl,
    method: 'PURGE',
    headers: {'X-Auth-Token': session.authToken},
		body: files
	};

  request(req, function(err, data) {
    if (err || !data) {
      callback(err, {success: false});
    } else {
      if (data.statusCode == 201) {
        callback(null, {
          success: true
        });
      } else {
        callback(null, {
          success: false,
          selectelMessage: data.body
        });
      }
    }
  });
};
