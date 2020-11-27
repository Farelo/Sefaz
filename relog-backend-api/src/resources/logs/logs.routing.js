const express = require('express')
const router = express.Router()
const logs_controller = require('./logs.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')

router.get('/', [auth], logs_controller.all)
router.post('/', [auth, authz], logs_controller.create)
router.delete('/:id', [auth, authz, validate_object_id], logs_controller.delete)

module.exports = router

