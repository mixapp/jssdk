'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Workspace = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _storage = require('./storage');

var _process = require('./process');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Workspace = exports.Workspace = function () {
    function Workspace() {
        var _this = this;

        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var client = arguments[1];

        _classCallCheck(this, Workspace);

        Object.defineProperty(this, '_client', {
            enumerable: false,
            value: client
        });

        Object.defineProperty(this, 'storages', {
            enumerable: false,
            value: {
                getAll: function getAll() {
                    return _this._client.get('/v1/workspaces/' + _this.name + '/storages').then(function (res) {
                        return res.result.map(function (item) {
                            return new _storage.Storage(item, _this.name, _this._client);
                        });
                    });
                },

                create: function create(data) {
                    return _this._client.post('/v1/workspaces/' + _this.name + '/storages', data).then(function (res) {
                        return new _storage.Storage(res.result, _this.name, _this._client);
                    });
                },

                get: function get(name) {
                    return _this._client.get('/v1/workspaces/' + _this.name + '/storages/' + name).then(function (res) {
                        return new _storage.Storage(res.result, _this.name, _this._client);
                    });
                }
            }
        });

        Object.defineProperty(this, 'processes', {
            enumerable: false,
            value: {
                search: function search(filter) {
                    return _this._client.get('/v1/workspaces/' + _this.name + '/processes', filter).then(function (res) {
                        return {
                            total: res.total,
                            items: res.items.map(function (item) {
                                return new _process.Process(item, _this.name, _this._client);
                            })
                        };
                    });
                },

                get: function get(id) {
                    return _this._client.get('/v1/workspaces/' + _this.name + '/processes/' + id).then(function (res) {
                        return new _process.Process(res.result, _this.name, _this._client);
                    });
                },

                create: function create(data) {
                    return _this._client.post('/v1/workspaces/' + _this.name + '/processes', data).then(function (res) {
                        return new _process.Process(res.result, _this.name, _this._client);
                    });
                }
            }
        });

        this.name = params.name;
        this.title = params.title;
        this.plan = params.plan;
        this.npm = params.npm;
    }

    _createClass(Workspace, [{
        key: 'stats',
        value: function stats() {
            return this._client.get('/v1/workspaces/' + this.name + '/statistics');
        }
    }, {
        key: 'fetch',
        value: function fetch() {
            var _this2 = this;

            return this._client.get('/v1/workspaces/' + this.name).then(function (res) {
                for (var prop in res.result) {
                    _this2[prop] = res.result[prop];
                }

                return res;
            });
        }
    }, {
        key: 'getBills',
        value: function getBills(skip, limit) {
            return this._client.get('/v1/workspaces/' + this.name + '/billing', { skip: skip, limit: limit });
        }
    }, {
        key: 'buyPlan',
        value: function buyPlan(plan) {
            return this._client.post('/v1/workspaces/' + this.name + '/billing', plan).then(function (res) {
                return res.result;
            });
        }
    }, {
        key: 'getKeys',
        value: function getKeys() {
            return this._client.get('/v1/workspaces/' + this.name + '/keys');
        }
    }, {
        key: 'createKey',
        value: function createKey(model) {
            return this._client.post('/v1/workspaces/' + this.name + '/keys', model);
        }
    }, {
        key: 'updateKey',
        value: function updateKey(id) {
            return this._client.post('/v1/workspaces/' + this.name + '/keys/' + id, {});
        }
    }, {
        key: 'removeKey',
        value: function removeKey(id) {
            return this._client.del('/v1/workspaces/' + this.name + '/keys/' + id);
        }
    }, {
        key: 'update',
        value: function update(data) {
            var _this3 = this;

            data = _extends({
                name: this.name
            }, data);

            return this._client.post('/v1/workspaces/' + this.name, data).then(function (res) {
                for (var prop in res.result) {
                    _this3[prop] = res.result[prop];
                }

                return res;
            });
        }
    }, {
        key: 'remove',
        value: function remove() {
            return this._client.del('/v1/workspaces/' + this.name);
        }
    }, {
        key: 'getConnectors',
        value: function getConnectors(filter) {
            return this._client.get('/v1/workspaces/' + this.name + '/connectors', filter);
        }
    }, {
        key: 'getConnector',
        value: function getConnector(id) {
            return this._client.get('/v1/workspaces/' + this.name + '/connectors/' + id, {}).then(function (res) {
                return res.result;
            });
        }
    }]);

    return Workspace;
}();