var https = null;
if (typeof XMLHttpRequest === 'undefined') {
    https = require('http');
}

export default class Http {

    constructor(params) {

        this.port = params.port || 443;
        this.host = params.host || 'api.mixapp.io';
        this.headers = {};
        this.token = params.token || '';
        this.timeout = params.timeout || 10000;

    }

    get(path, data, headers) {
        return this._request('get', path, data, headers);
    }

    post(path, data, headers) {
        return this._request('POST', path, data, headers);
    }

    del(path, data, headers) {
        return this._request('DELETE', path, data, headers);
    }

    setToken(token) {
        this.token = token;
        this.setHeader('X-Auth-Token', token);
    }

    setHeader(name, val) {
        this.headers[name] = val;
    }

    setTimeout() {}


    _node_request(method, path, data = {}, headers) {

        headers = {
            ...this.headers,
            ...headers
        };

        if (method.toLowerCase() === 'post') {
            headers['Content-Type'] = 'application/json';
        }

        var query = '';
        if (method.toLowerCase() === 'get') {
            let _query = [];
            for (let prop in data) {
                _query.push(prop + '=' + data[prop])
            }

            query = _query.join('&');
        }

        const promise = new Promise((resolve, reject) => {
            const request = https.request({
                method: method,
                port: this.port,
                path: path + '?' + query,
                host: this.host,
                headers: headers
            }, function(res) {
                let result = "";
                if (res.statusCode !== 200) {
                    return reject({
                        error_code     : res.statusCode,
                        error_message      : res.responseText || 'Invalid statusCode'
                    });
                }

                res.on('data', function(data) {
                    result += data.toString();
                });

                res.on('error', function(err) {
                    return reject({
                        error_code     : res.statusCode,
                        error_message      : err.message
                    });
                });

                res.on('end', function(){
                    return resolve(result);
                })
            });

            request.on('aborted', function () {
                return reject({
                    error_code     : 504,
                    error_message      : 'Request has been aborted by the server'
                });
            });

            request.on('abort', function () {
                return reject({
                    error_code     : 418,
                    error_message      : 'Request has been aborted by the client'
                });
            });

            request.on('error', function (err) {
                return reject({
                    error_code     : 422,
                    error_message      : err.message
                });
            });

            request.setTimeout(this.timeout, function(){
                request.abort();
            });

            if (method.toLowerCase() === 'post') {
                request.write(JSON.stringify(data));
            }

            request.end();
        })
            .then(res => {
                return JSON.parse(res);
            })
            .then(res => {
                if (res.error_code) {
                    return Promise.reject(res);
                }

                return res;
            });

        return promise

    }
    _ajax(method, path, data, headers) {
        const promise = new Promise((resolve, reject) => {

            var query = '';
            if (method.toLowerCase() === 'get') {
                let _query = [];
                for (let prop in data) {
                    _query.push(prop + '=' + data[prop])
                }

                query = _query.join('&');
            }

            let url = 'https://' + this.host + ':' + this.port + path + '?' + query;
            var xhr = new XMLHttpRequest();

            xhr.timeout = this.timeout;
            xhr.open(method, url, true);

            for (let prop in this.headers) {
                xhr.setRequestHeader(prop, this.headers[prop]);
            }

            for (let prop in headers) {
                xhr.setRequestHeader(prop, headers[prop]);
            }

            if (method.toLowerCase() === 'post') {
                xhr.setRequestHeader('Content-Type', 'application/json');
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState != 4) return;

                if (xhr.status != 200) {
                    
                    return reject({
                        error_code     : xhr.status,
                        error_message      : xhr.responseText || 'Invalid statusCode'
                    });
                } else {
                    resolve(xhr.responseText)
                }
            };

            if (method.toLowerCase() === 'post') {
                xhr.send(JSON.stringify(data))
            } else {
                xhr.send()
            }

        })
            .then(res => {
                return JSON.parse(res);
            })
            .then(res => {
                if (res.error_code) {
                    return Promise.reject(res);
                }

                return res;
            });

        return promise;
    }

    _request(method, path, data, headers) {
        if (typeof XMLHttpRequest !== 'undefined') {
            return this._ajax(method, path, data, headers);
        }
        return this._node_request(method, path, data, headers);
    }


}