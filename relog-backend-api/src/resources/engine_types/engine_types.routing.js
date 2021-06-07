const express = require('express')
const router = express.Router()
const engine_types_controller = require('./engine_types.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_engine_types } = require('./engine_types.model')

router.get('/', [auth], engine_types_controller.all)
router.get('/:id', [auth, validate_object_id], engine_types_controller.show)
router.post('/', [auth, authz, validate_joi(validate_engine_types)], engine_types_controller.create)
router.patch('/:id', [auth, authz, validate_object_id, validate_joi(validate_engine_types)], engine_types_controller.update)
router.delete('/:id', [auth, authz, validate_object_id], engine_types_controller.delete)

module.exports = router

// GET '/'
/**
 * @swagger
 * /engine_types:
 *   get:
 *     summary: Retrieve all engine_types
 *     description: Retrieve all engine_types on database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - EngineTypes
 *     parameters:
 *       - name: code
 *         description: Return engine_types filtered by tag code
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: list of all engine_types
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/:id'
/**
 * @swagger
 *
 * /engine_types/{id}:
 *   get:
 *     summary: Create a engine_types
 *     description: Create a engine_type
 *     security:
 *       - Bearer: []
 *     tags:
 *       - EngineTypes
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Engine_types id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Engine_types is valid request
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
 * /engine_types:
 *   post:
 *     summary: Create a engine_type
 *     description: Create a engine_type
 *     security:
 *       - Bearer: []
 *     tags:
 *       - EngineTypes
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: engine_type
 *         description: Engine_type object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Engine_typeObject'
 *     responses:
 *       200:
 *         description: Engine_type is valid request
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
 * /engine_types/{id}:
 *   patch:
 *     summary: Update a engine_type
 *     description: Update a engine_type by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - EngineTypes
 *     parameters:
 *       - name: id
 *         description: Engine_type id
 *         in: path
 *         required: true
 *         type: string
 *       - name: engine_type
 *         description: Engine_type object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Engine_typeObject'
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
 * /engine_types/{id}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - EngineTypes
 *     summary: Delete a engine_type
 *     description: Deleta a engine_type
 *     parameters:
 *       - name: id
 *         description: Engine_type id
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
 *   Engine_typeObject:
 *     type: object
 *     required:
 *       - code
 *     properties:
 *       code:
 *         type: string
 *       observations:
 *         type: string
 *      
 */