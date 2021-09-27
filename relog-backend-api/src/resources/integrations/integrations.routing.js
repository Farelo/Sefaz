const express = require('express')
const router = express.Router()
const integration_controller = require('./integrations.controller')
const auth = require('../../security/auth.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')


//router.post('/', integration_controller.create_IntegrationId);

module.exports = router;


// POST '/'
/**
 * @swagger
 *
 * /integration:
 *   post:
 *     summary: Integration between racks and engines
 *     description: Integration between racks and engines
 *     tags:
 *       - Integration
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description:  valid request
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *
 */

