export class Process {
    constructor(data, workspace, client) {
        for (let prop in data) {
            this[prop] = data[prop];
        }

        Object.defineProperty(this, '_workspace', {
            enumerable: false,
            value: workspace
        });
        Object.defineProperty(this, '_client', {
            enumerable: false,
            value: client
        });
    }

    fetch() {
        return this._client.get('/v1/workspaces/' + this._workspace + '/processes/' + this.id)
            .then(res => {
                for (let prop in res.result) {
                    this[prop] = res.result[prop];
                }
                return this;
            });
    }

    getContext(skip, limit) {
        return this._client.get('/v1/workspaces/' + this._workspace + '/processes/' + this.id + '/context', {
            skip: skip,
            limit: limit
        });
    }

    getLogs(skip, limit) {
        return this._client.get('/v1/workspaces/' + this._workspace + '/processes/' + this.id + '/logs', {
            skip: skip,
            limit: limit
        });
    }

    update(data) {
        return this._client.post('/v1/workspaces/' + this._workspace + '/processes/' + this.id, data)
            .then(res => {
                for (let prop in res.result) {
                    this[prop] = res.result[prop];
                }
                return this;
            });
    }

    remove() {
        return this._client.del('/v1/workspaces/' + this._workspace + '/processes/' + this.id);
    }

    createVariable(data) {
        return this._client.post('/v1/workspaces/' + this._workspace + '/processes/' + this.id + '/variables', data)
            .then(res => {
                return res.result;
            });
    }

    updateVariable(name, data) {
        return this._client.post('/v1/workspaces/' + this._workspace + '/processes/' + this.id + '/variables/' + name, data)
            .then(res => {
                return res.result;
            });
    }

    removeVariable(name) {
        return this._client.del('/v1/workspaces/' + this._workspace + '/processes/' + this.id + '/variables/' + name);
    }

    start(data) {
        return this._client.post('/v1/workspaces/' + this._workspace + '/processes/' + this.id + '/start', data);
    }

    stop() {
        return this._client.post('/v1/workspaces/' + this._workspace + '/processes/' + this.id + '/stop', {});
    }

    createConnector(data) {
        return this._client.post('/v1/workspaces/' + this._workspace + '/processes/' + this.id + '/connectors', data)
            .then(res => res.result);
    }

    updateConnector(id, data) {
        return this._client.post('/v1/workspaces/' + this._workspace + '/processes/' + this.id + '/connectors/' + id, data)
            .then(res => res.result);
    }

    moveConnector(id, x, y) {
        return this._client.post('/v1/workspaces/' + this._workspace + '/processes/' + this.id + '/connectors/' + id + '/move', {
            positionX: x,
            positionY: y
        });
    }

    removeConnector(id) {
        return this._client.del('/v1/workspaces/' + this._workspace + '/processes/' + this.id + '/connectors/' + id, {});
    }

    setRelation(source, target) {
        return this._client.post('/v1/workspaces/' + this._workspace + '/processes/' + this.id + '/connectors/' + source + '/relation/' + target, {});
    }

    setRelationName(source, target, name) {
        return this._client.post('/v1/workspaces/' + this._workspace + '/processes/' + this.id + '/connectors/' + source + '/relation/' + target + '/' + name, {});
    }

    unsetRelation(source, target) {
        return this._client.del('/v1/workspaces/' + this._workspace + '/processes/' + this.id + '/connectors/' + source + '/relation/' + target, {});
    }

}