"use strict"

const config = require('config');
const moment = require('moment');
const _ = require('underscore');

const log = require("./helpers/logger");

const requestFactory = function(requestParameters){
    log.trace("Creating new request object");
    return new createRequestObject(requestParameters);
};


/**
 * Set defaults and overwrite with task values
 *
 * @param requestParameters
 */
const createRequestObject = function(requestParameters) {
    this.localObject = {};
    this.index = (requestParameters.index) ? requestParameters.index.toString() : undefined;
    this.start = config.has('start') ? config.get('start') : moment.utc().subtract(32, 'days').unix();
    this.end = config.has('end') ? config.get('end') : moment.utc().unix();
    this.analysis_type = requestParameters.analysis_type;
    this.target = requestParameters.target;
    this.threshold = requestParameters.threshold || 200;
    this.interval = requestParameters.interval;
    this.span = requestParameters.span || undefined;
    this.user = process.env.AUTH_USER || ( config.has('index.' + this.index + '.auth.username') ? config.get('index.' + this.index + '.auth.username') : (config.has('index.default.auth.username') ? config.get('index.default.auth.username') : ""));
    this.pass = process.env.AUTH_KEY || ( config.has('index.' + this.index + '.auth.api_key') ? config.get('index.' + this.index + '.auth.api_key') : (config.has('index.default.auth.api_key') ? config.get('index.default.auth.api_key') : ""));
    this.subscription_id = process.env.SUBSCRIPTION_ID || (config.has('index.' + this.index + '.subscription_id') ? config.get('index.' + this.index + '.subscription_id') : (config.has('index.default.subscription_id') ? config.get('index.default.subscription_id') : ""));
    this.filter = requestParameters.filter || undefined;
    this.name = this.localObject.name = requestParameters.name;
    this.child = requestParameters.child || undefined;
    this.childTarget = (requestParameters.child) ? requestParameters.child.target : undefined;
    this.childThreshold = (requestParameters.child && requestParameters.child.threshold) ? requestParameters.child.threshold : 200;
    this.grandChild = requestParameters.grandChild || undefined;
    this.grandChildTarget = (requestParameters.grandChild) ? requestParameters.grandChild.target : undefined;
    this.grandChildThreshold = (requestParameters.grandChild && requestParameters.grandChild.threshold) ? requestParameters.grandChild.threshold : 200;

    if(requestParameters.then) {
        this.localObject.then = requestParameters.then;
    }

    if(requestParameters.cache) {
        this.localObject.cache = requestParameters.cache;
    }
};


/**
 * Create an /analyze request object
 *
 * @returns {}
 */
createRequestObject.prototype.analyze = function(){

    let params = { 'target': this.target, 'threshold': this.threshold };

    if(this.analysis_type === "timeSeries"){
        params = { 'interval': this.interval };
        if(this.span) params.span = this.span;
    }

    let returnObj = {
        'method': 'POST',
        'auth': {
            'user': this.user,
            'pass': this.pass,
        },
        'uri': "https://api.datasift.com/v1.3/pylon/analyze",
        'json': {
            'id': this.subscription_id,
            'start': this.start,
            'end': this.end,
            'parameters': {
                'analysis_type': this.analysis_type,
                'parameters': params
            }
        }
    };

    if(this.filter) {
        returnObj.json.filter = this.filter;
    }

    if(this.child) {
        returnObj.json.parameters.child = {
            'analysis_type': 'freqDist',
            'parameters': {
                'target': this.childTarget,
                'threshold': this.childThreshold
            }
        };
    }

    if(this.grandChild) {
        returnObj.json.parameters.child.child = {
            'analysis_type': 'freqDist',
            'parameters': {
                'target': this.grandChildTarget,
                'threshold': this.grandChildThreshold
            }
        };
    }

    return _.extend(returnObj, this.localObject);

};

createRequestObject.prototype.task = function(){
    return this.localObject;
};

module.exports.requestFactory = requestFactory;