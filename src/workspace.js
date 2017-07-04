import {Storage} from './storage'
import {Process} from './process'

export class Workspace {
    constructor(params = {}, client) {
        Object.defineProperty(this, '_client', {
            enumerable: false,
            value: client
        });



        Object.defineProperty(this, 'storages', {
            enumerable: false,
            value: {
                getAll: () => {
                    return this._client.get('/v1/workspaces/' + this.name + '/storages')
                        .then(res => {
                            return res.result.map(item => {
                                return new Storage(item, this.name, this._client);
                            });
                        });
                },

                create: (data) => {
                    return this._client.post('/v1/workspaces/' + this.name + '/storages', data)
                        .then(res => {
                            return new Storage(res.result, this.name, this._client);
                        });
                },

                get: (name) => {
                    return this._client.get('/v1/workspaces/' + this.name + '/storages/' + name)
                        .then(res => {
                            return new Storage(res.result, this.name, this._client);
                        });
                }
            }
        });

        Object.defineProperty(this, 'processes', {
            enumerable: false,
            value: {
                search: (filter) => {
                    return this._client.get('/v1/workspaces/' + this.name + '/processes', filter)
                        .then(res => {
                            return {
                                total: res.total,
                                items: res.items.map(item => new Process(item, this.name, this._client))
                            }
                        });
                },

                get: (id) => {
                    return this._client.get('/v1/workspaces/' + this.name + '/processes/' + id)
                        .then(res => {
                            return new Process(res.result, this.name, this._client)
                        });
                },

                create: (data) => {
                    return this._client.post('/v1/workspaces/' + this.name + '/processes', data)
                        .then(res => {
                            return new Process(res.result, this.name, this._client);
                        });
                }
            }
        });

        Object.defineProperty(this, 'marketplace', {
            enumerable: false,
            value: {
                getConnectors: (skip, limit) => {
                    return this._client.get(`/v1/workspaces/${this.name}/marketplace/connectors`, {skip, limit});
                }
            }
        });

        this.name = params.name;
        this.title = params.title;
        this.plan = params.plan;
        this.npm = params.npm;
    }

    stats() {
        return this._client.get('/v1/workspaces/' + this.name + '/statistics');
    }

    fetch() {
        return this._client.get('/v1/workspaces/' + this.name)
            .then(res => {
                for (let prop in res.result) {
                    this[prop] = res.result[prop];
                }

                return res;
            });

    }

    getBills(skip, limit) {
        return this._client.get('/v1/workspaces/' + this.name + '/billing', {skip, limit});
    }

    buyPlan(plan) {
        return this._client.post('/v1/workspaces/' + this.name + '/billing', plan).then(res => res.result);
    }

    getKeys() {
        return this._client.get('/v1/workspaces/' + this.name + '/keys');
    }

    createKey(model) {
        return this._client.post('/v1/workspaces/' + this.name + '/keys', model);
    }

    updateKey(id) {
        return this._client.post(`/v1/workspaces/${this.name}/keys/${id}`, {});
    }

    removeKey(id) {
        return this._client.del(`/v1/workspaces/${this.name}/keys/${id}`);
    }

    update(data) {
        data = {
            name: this.name,
            ...data
        };

        return this._client.post('/v1/workspaces/' + this.name, data)
            .then(res => {
                for (let prop in res.result) {
                    this[prop] = res.result[prop];
                }

                return res;
            });
    }

    remove() {
        return this._client.del('/v1/workspaces/' + this.name);
    }

    getConnectors(filter) {
        return this._client.get('/v1/workspaces/' + this.name + '/connectors', filter);
    }

    uploadConnector(model) {
        return this._client.post(`/v1/workspaces/${this.name}/connectors`, model);
    }

    removeConnector(id) {
        return this._client.del(`/v1/workspaces/${this.name}/connectors/${id}`);
    }

    getConnector(id) {
        return this._client.get('/v1/workspaces/' + this.name + '/connectors/' + id, {}).then(res => res.result);
    }

}