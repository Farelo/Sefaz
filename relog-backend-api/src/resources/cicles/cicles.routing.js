const express = require('express')
const router = express.Router()
const cicles_controller = require('./cicles.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_cicles } = require('./cicles.model')

//router.post('/', integration_controller.create_IntegrationId);
router.get('/', [auth], cicles_controller.all)
router.patch('/:id', [auth, authz, validate_joi(validate_cicles)], cicles_controller.update)
router.delete('/:id', [auth, authz ], cicles_controller.delete)


module.exports = router;


// POST '/'
/**
 * @swagger
 *
 * /cicles:
 *   post:
 *     summary: cicles of racks
 *     description: cicles of racks
 *     tags:
 *       - Cicles
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
 * /cicles:
 *   get:
 *     summary: Retrieve all cicles
 *     description: Retrieve all cicles on database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Cicles
 *     parameters:
 *       - name: Id
 *         description: Return all cicles filtered by Id
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: list of all cicles
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// PATCH '/:id'
/**
 * @swagger
 * /cicles/{id}:
 *   patch:
 *     summary: Update a cicles
 *     description: Update a cicles by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Cicles
 *     parameters:
 *       - name: id
 *         description: cicles id
 *         in: path
 *         required: true
 *         type: string
 *       - name: cicles
 *         description: cicles object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/CiclesObject'
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
 * /cicles/{id}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Cicles
 *     summary: Delete a cicles
 *     description: Delete a cicles
 *     parameters:
 *       - name: id
 *         description: cicles id
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
 *   CiclesObject:
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