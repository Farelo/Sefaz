const express = require('express')
const router = express.Router()
const racks_controller = require('./racks.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_racks } = require('./racks.model')

