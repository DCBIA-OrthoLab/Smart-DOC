'use strict';

const Stream = require('stream');

class Filter extends Stream.Transform {
    constructor(options) {
        options = Object.assign({}, options, {
            objectMode: true
        });
        super(options);
    }
    _transform(data, enc, next) {
        
        if (data.event === 'response' && data.config.suppressResponseEvent === true) {

            return next();
        }

        return next(null, data);
    }
}

module.exports = Filter;
