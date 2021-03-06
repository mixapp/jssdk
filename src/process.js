export class Process {
    constructor(data, workplace, client) {
        for (let prop in data) {
            this[prop] = data[prop];
        }

        Object.defineProperty(this, '_workplace', {
            enumerable: false,
            value: workplace
        });
        Object.defineProperty(this, '_client', {
            enumerable: false,
            value: client
        });
    }

    fetch() {
        return this._client.get('/v1/workplaces/' + this._workplace + '/processes/' + this.id)
            .then(res => {
                for (let prop in res.result) {
                    this[prop] = res.result[prop];
                }
                return this;
            });
    }

    getLogs(skip, limit) {
        return this._client.get('/v1/workplaces/' + this._workplace + '/processes/' + this.id + '/logs', {
            skip: skip,
            limit: limit
        });
    }

    flushLogs() {
        return this._client.del('/v1/workplaces/' + this._workplace + '/processes/' + this.id + '/logs', {});
    }

    update(data) {
        return this._client.post('/v1/workplaces/' + this._workplace + '/processes/' + this.id, {}, data)
            .then(res => {
                for (let prop in res.result) {
                    this[prop] = res.result[prop];
                }
                return this;
            });
    }

    clone(data) {
        return this._client.post(`/v1/workplaces/${this._workplace}/processes/${this.id}/clone`, {}, data);
    }

    remove() {
        return this._client.del('/v1/workplaces/' + this._workplace + '/processes/' + this.id);
    }

    start(data) {
        return this._client.post('/v1/workplaces/' + this._workplace + '/processes/' + this.id + '/start', {}, data);
    }

    stop() {
        return this._client.post('/v1/workplaces/' + this._workplace + '/processes/' + this.id + '/stop', {});
    }

    createConnector(data) {
        return this._client.post('/v1/workplaces/' + this._workplace + '/processes/' + this.id + '/connectors', {}, data)
            .then(res => res.result);
    }

    updateConnector(id, data) {
        return this._client.post('/v1/workplaces/' + this._workplace + '/processes/' + this.id + '/connectors/' + id, {}, data)
            .then(res => res.result);
    }

    upgradeConnector(id) {
      return this._client.post('/v1/workplaces/' + this._workplace + '/processes/' + this.id + '/connectors/' + id + '/upgrade', {}, {})
          .then(res => res.result);
    }

    moveConnector(id, x, y) {
        return this._client.post('/v1/workplaces/' + this._workplace + '/processes/' + this.id + '/connectors/' + id + '/move', {}, {
            positionX: x,
            positionY: y
        });
    }

    removeConnector(id) {
        return this._client.del('/v1/workplaces/' + this._workplace + '/processes/' + this.id + '/connectors/' + id, {});
    }

    setTransformRules(source, target, rules) {
        return this._client.post('/v1/workplaces/' + this._workplace + '/processes/' + this.id + '/connectors/' + source + '/rules/' + target, {}, rules);
    }

    setRelation(source, target) {
        return this._client.post('/v1/workplaces/' + this._workplace + '/processes/' + this.id + '/connectors/' + source + '/relation/' + target, {});
    }

    setRelationName(source, target, name) {
        return this._client.post('/v1/workplaces/' + this._workplace + '/processes/' + this.id + '/connectors/' + source + '/relation/' + target + '/' + name, {});
    }

    unsetRelation(source, target) {
        return this._client.del('/v1/workplaces/' + this._workplace + '/processes/' + this.id + '/connectors/' + source + '/relation/' + target, {});
    }

}