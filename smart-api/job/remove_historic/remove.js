'use strict';

const cron = require('node-cron');

var task = cron.schedule(`*/${environment.time} * * * * *`, function() {
    
});

exports.module = task