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
 * /engineTypes:
 *   get:
 *     summary: Retrieve all engineTypes
 *     description: Retrieve all engineTypes on database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - EngineTypes
 *     parameters:
 *       - name: code
 *         description: Return engineTypes filtered by tag code
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: list of all engineTypes
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/:id'
/**
 * @swagger
 *
 * /engineTypes/{id}:
 *   get:
 *     summary: Create a engineTypes
 *     description: Create a engineTypes
 *     security:
 *       - Bearer: []
 *     tags:
 *       - EngineTypes
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: EngineTypes id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: EngineTypes is valid request
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
 * /engineTypes:
 *   post:
 *     summary: Create a engineType
 *     description: Create a engineType
 *     security:
 *       - Bearer: []
 *     tags:
 *       - EngineTypes
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: engineType
 *         description: EngineType object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/EngineTypeObject'
 *     responses:
 *       200:
 *         description: EngineType is valid request
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
 * /engineTypes/{id}:
 *   patch:
 *     summary: Update a engineType
 *     description: Update a engineType by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - EngineTypes
 *     parameters:
 *       - name: id
 *         description: EngineType id
 *         in: path
 *         required: true
 *         type: string
 *       - name: engineType
 *         description: EngineType object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/EngineTypeObject'
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
 * /engineTypes/{id}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - EngineTypes
 *     summary: Delete a engineType
 *     description: Deleta a engineType
 *     parameters:
 *       - name: id
 *         description: EngineType id
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
 *   EngineTypeObject:
 *     type: object
 *     required:
 *       - code
 *     properties:
 *       code:
 *         type: string
 *      
 */