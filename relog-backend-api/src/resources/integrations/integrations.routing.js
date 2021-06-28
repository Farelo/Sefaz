const express = require('express')
const router = express.Router()
const integration_controller = require('./integrations.controller')
const auth = require('../../security/auth.middleware')

router.post('/integrations', auth, integration_controller.import_rack)

module.exports = router


// POST '/'
/**
 * @swagger
 *
 * /engine_types:
 *   post:
 *     summary: Integration between racks and engines
 *     description: Integration between racks and engines
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Integration
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: integration
 *         description: Integration object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/IntegrationObject'
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

/**
 * @swagger
 *
 * definitions:
 *   IntegrationObject:
 *     type: object
 *     required:
 *       - code
 *       - model
 *       - serial_engine
 *       - date
 *       - rack_model
 *       - id_rack
 *     properties:
 *       code:
 *         type: string
 *       model:
 *         type: string
 *       serial_engine:
 *         type: string
 *       date:
 *         type: string
 *       rack_model:
 *         type: string
 *       id_rack:
 *         type: string
 *         
 *      
 */