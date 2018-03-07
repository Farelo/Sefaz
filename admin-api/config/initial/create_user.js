'use strict';

const constants          = require('../../api/helpers/utils/constants');
const schemas            = require('../database/require_schemas')

schemas.user().create(constants.system_user)
