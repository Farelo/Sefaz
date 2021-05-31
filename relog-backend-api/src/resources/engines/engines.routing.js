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
router.post('/', [auth, authz, validate_joi(validate_engines)], engines_controller.create)
router.post('/create_many', [auth, authz], engines_controller.create_many)
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
 *       - name: tag_code
 *         description: Return engine filtered by tag code
 *         in: query
 *         required: false
 *         type: string
 *       - name: engine_type
 *         description: Return engine filtered by engine type
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
 *     summary: Create a engine
 *     description: Create a engine
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

// POST '/'
/**
 * @swagger
 *
 * /engines:
 *   post:
 *     summary: Create a engine
 *     description: Create a engine
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Engines
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: engine
 *         description: Engine object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/EngineObject'
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

// POST '/'
/**
 * @swagger
 *
 * /engines/create_many:
 *   post:
 *     summary: Create a engine
 *     description: Create many engines
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Engines
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: engine
 *         description: Engine array
 *         in: body
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
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
 *     summary: Update a engine
 *     description: Update a engine by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Engines
 *     parameters:
 *       - name: id
 *         description: Engine id
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
 *       - id_engine_type
 *     properties:
 *       tag:
 *         $ref: '#/definitions/TagObject'
 *       serial:
 *         type: string
 *       part_number:
 *         type: string
 *       id_rack_transport:
 *         type: string
 *       engine_type:
 *         type: string
 *       model:
 *         type: string
 *       observations:
 *         type: string
 *       active:
 *         type: boolean
 *       
 */

 /**
 * @swagger
 *
 * definitions:
 *   TagObject:
 *     type: object
 *     required:
 *       - code
 *     properties:
 *       code:
 *         type: string
 *       
 *       
 *       
 */