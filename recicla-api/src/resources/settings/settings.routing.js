const express = require('express')
const router = express.Router()
const settings_controller = require('./settings.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_settings } = require('./settings.model')

router.get('/', [auth, authz], settings_controller.show)
router.patch('/:id', [auth, authz, validate_object_id, validate_joi(validate_settings)], settings_controller.update)

module.exports = router

// GET '/'
/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Retrieve a setting
 *     description: Retrieve a setting on database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Settings
 *     responses:
 *       200:
 *         description: list of all settings
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */


// PATCH '/:id'
/**
 * @swagger
 * /settings/{id}:
 *   patch:
 *     summary: Update a setting
 *     description: Update a setting by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Settings
 *     parameters:
 *       - name: id
 *         description: Setting id
 *         in: path
 *         required: true
 *         type: string
 *       - name: setting
 *         description: Setting object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/SettingObject'
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

 /**
 * @swagger
 *
 * definitions:
 *   SettingObject:
 *     type: object
 *     required:
 *       - family
 *     properties:
 *       enable_gc16:
 *         type: boolean
 *       battery_level_limit:
 *         type: number
 *       accuracy_limit:
 *         type: number
 *       job_schedule_time:
 *         type: number
 *       range_radius:
 *         type: number
 *       clean_historic_moviments_time:
 *         type: number
 *       no_signal_limit_in_days:
 *         type: number
 *       missing_sinal_limit_in_days:
 *         type: number
 */