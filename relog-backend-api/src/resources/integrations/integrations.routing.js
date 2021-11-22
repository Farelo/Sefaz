const express = require('express')
const router = express.Router()
const integrations_controller = require('./integrations.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_integrations } = require('./integrations.model')

//router.post('/', integration_controller.create_IntegrationId);
router.get('/', [auth], integrations_controller.all)
router.patch('/:id', [auth, authz, validate_joi(validate_integrations)], integrations_controller.update)
router.delete('/:id', [auth, authz ], integrations_controller.delete)


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

// GET '/'
/**
 * @swagger
 * /integration:
 *   get:
 *     summary: Retrieve all integrations
 *     description: Retrieve all integrations on database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Integration
 *     parameters:
 *       - name: Id
 *         description: Return all integrations filtered by Id
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: list of all Integrations
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// PATCH '/:id'
/**
 * @swagger
 * /integration/{id}:
 *   patch:
 *     summary: Update a Integration
 *     description: Update a Integration by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Integration
 *     parameters:
 *       - name: id
 *         description: Integration id
 *         in: path
 *         required: true
 *         type: string
 *       - name: integration
 *         description: Integration object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/IntegrationObject'
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// DELETE '/'
/**
 * @swagger
 * /integration/{id}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Integration
 *     summary: Delete a integration
 *     description: Delete a integration
 *     parameters:
 *       - name: id
 *         description: Integration id
 *         in: path
 *         required: true
 *         type: string
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
 *   IntegrationObject:
 *     type: object
 *     required:
 *       - id
 *     properties:
 *       active:
 *         type: boolean
 *       family:
 *          type: string
 *       serial:
 *         type: string
 *       serial2:
 *         type: string
 *       fabrication_date:
 *         type: string
 *         format: date
 *         example: 2021-10-24T22:55:38.916+00:00
 *       id_engine_type:
 *         type: string
 *       id_rack:
 *         type: string
 *       integration_date:
 *          type: string
 *          format: date
 *          example: 2021-10-24T22:55:38.916+00:00
 *     
 */