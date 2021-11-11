const express = require('express')
const router = express.Router()
const engines_controller = require('./engines.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_engines } = require('./engines.model')

router.get('/', [auth], engines_controller.all)
router.get('/:id', [auth, validate_object_id], engines_controller.show)
router.patch('/:id', [auth, authz, validate_object_id, validate_joi(validate_engines)], engines_controller.update)
router.delete('/:id', [auth, authz, validate_object_id], engines_controller.delete)

module.exports = router

// GET '/'
/**
 * @swagger
 * /engines:
 *   get:
 *     summary: Retrieve all engines
 *     description: Retrieve all engines on database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Engines
 *     parameters:
 *       - name: serial
 *         description: Return all engines filtered by serial
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: list of all engines
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
// GET '/:id'
/**
 * @swagger
 *
 * /engines/{id}:
 *   get:
 *     summary: List Engines by id
 *     description: list Engines by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Engines
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Engine id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Engine is valid request
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *
 */


// PATCH '/:id'
/**
 * @swagger
 * /engines/{id}:
 *   patch:
 *     summary: Update a Engine
 *     description: Update a Engine by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Engines
 *     parameters:
 *       - name: id
 *         description: engine id
 *         in: path
 *         required: true
 *         type: string
 *       - name: engine
 *         description: Engine object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/EngineObject'
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
 * /engines/{id}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Engines
 *     summary: Delete a engine
 *     description: Delete a engine
 *     parameters:
 *       - name: id
 *         description: Engine id
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
 *   EngineObject:
 *     type: object
 *     required:
 *       - serial
 *     properties:
 *       serial:
 *         type: string
 *       fabrication_date:
 *         type: string
 *         format: date
 *         example: 2019-02-01
 *       observations:
 *         type: string
 *       active:
 *         type: boolean
 *       id_engine_type:
 *         type: string
 *       id_rack:
 *         type: string
 * 
 */