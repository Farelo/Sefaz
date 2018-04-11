'use strict';

const cron                       = require('node-cron');
const token                      = require('./consults/token');
const devices                    = require('./consults/devices');
const consultDatabase            = require('./consults/consult');
const updateDevices              = require('./updates/update_devices');
const with_route                 = require('./routes/with_route');
const without_route              = require('./routes/without_route');
const evaluate_battery           = require('./alerts/evaluate_battery');
const actual_plant               = require('./positions/actual_plant');
const evaluate_department        = require('./positions/evaluate_department');
const verify_finish              = require('./evaluates/verify_finish');
const evaluate_missing           = require('./alerts/evaluate_missing');
const update_packing             = require('./updates/update_packing');
const traveling                  = require('./alerts/traveling');
const remove_dependencies        = require('./updates/remove_dependencies');
const environment                = require('../config/environment');

var task = cron.schedule(`*/${environment.time} * * * * *`, function() {
    
});

exports.module = task