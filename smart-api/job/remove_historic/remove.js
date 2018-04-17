'use strict';

const cron = require('node-cron');

//TODO
var task = cron.schedule(`*/${environment.time} * * * * *`, function() {
    
});

exports.module = task