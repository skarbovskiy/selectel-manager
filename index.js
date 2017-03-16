const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const assert = require('assert');
/**
  login
  password
*/
module.exports = options => {
  return new Storage(options);
};

let Storage = function (options) {
  assert(options.login);
  assert(options.password);

  this.options = options;

  this.session = {
    isAuthorized: false,
    url: null,
    token: null
  };

  let authorize = () => {
    return request({
      url: 'https://auth.selcdn.ru/',
      headers: {
        'X-Auth-User': this.options.login,
        'X-Auth-Key': this.options.password
      }
    })
      .then(res => {
        if (res.statusCode != 204) {
          throw new Error(`can't authenticate request`);
        }
        this.session.url = res.headers['x-storage-url'];
        this.session.token = res.headers['x-storage-token'];
        this.session.isAuthorized = true;

        let timeout = parseInt(res.headers['x-expire-auth-token']) - 1000;

        setTimeout(() => {
          this.session.isAuthorized = false;
        }, timeout < 0 ? 0 : timeout);
      });
  };

  let makeRequest = options => {
    let checkAuth = () => {
      if (this.session.isAuthorized) {
        return Promise.resolve();
      }
      return authorize();
    };
    return checkAuth()
      .then(() => {
        options.url = this.session.url + options.url;
        if (!options.headers) {
          options.headers = {};
        }
        options.headers['X-Auth-Token'] = this.session.token;
        return request(options);
      })
      .then(res => {
        if (res.statusCode >= 300) {
          let error = new Error('selectel request failed');
          error.statusCode = res.statusCode;
          error.body = res.body;
          error.headers = res.headers;
          return Promise.reject(error);
        }
        return res;
      });
  };

  return {
    createContainer: (container, headers = {}) => {
      return makeRequest({
        url: `/${container}`,
        method: 'PUT',
        headers
      });
    },
    getContainerFiles: (container, qs = {format: 'json'}) => {
      return makeRequest({
        url: `/${container}`,
        method: 'GET',
        qs
      });
    },
    uploadFile: (body, path, archiveFormat = null, headers = {}) => {
      let url = `/${path}`;
      if (archiveFormat) {
        url += `?extract-archive=${archiveFormat}`;
      }
      return makeRequest({
        url,
        method: 'PUT',
        headers,
        body
      });
    },
    clearCache: files => {
      let body = files.join('\n');
      return makeRequest({
        url: '/',
        method: 'PURGE',
        body
      });
    },
    deleteFile: file => {
      return makeRequest({
        url: `/${file}`,
        method: 'DELETE'
      });
    }
  };
};
