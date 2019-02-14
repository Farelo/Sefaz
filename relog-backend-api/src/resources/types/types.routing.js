const express = require('express')
const router = express.Router()
const types_controller = require('./types.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_types } = require('./types.model')

router.get('/', [auth], types_controller.all)
router.get('/:id', [auth, validate_object_id], types_controller.show)
router.post('/', [auth, authz, validate_joi(validate_types)], types_controller.create)
router.patch('/:id', [auth, authz, validate_object_id, validate_joi(validate_types)], types_controller.update)
router.delete('/:id', [auth, authz, validate_object_id], types_controller.delete)

module.exports = router

// GET '/'
/**
 * @swagger
 * /types:
 *   get:
 *     summary: Retrieve all types
 *     description: Retrieve all types on database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Types
 *     parameters:
 *       - name: name
 *         description: Return type filtered by name
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: list of all types
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/:id'
/**
 * @swagger
 *
 * /types/{id}:
 *   get:
 *     summary: Create a type
 *     description: Create a type
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Types
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Type id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Type is valid request
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
 * /types:
 *   post:
 *     summary: Create a type
 *     description: Create a type
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Types
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: type
 *         description: Type object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/TypeObject'
 *     responses:
 *       200:
 *         description: Type is valid request
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
 * /types/{id}:
 *   patch:
 *     summary: Update a type
 *     description: Update a type by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Types
 *     parameters:
 *       - name: id
 *         description: Type id
 *         in: path
 *         required: true
 *         type: string
 *       - name: type
 *         description: Type object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/TypeObject'
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
 * /types/{id}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Types
 *     summary: Delete a type
 *     description: Deleta a type
 *     parameters:
 *       - name: id
 *         description: Type id
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
 *   TypeObject:
 *     type: object
 *     required:
 *       - name
 *     properties:
 *       name:
 *         type: string
 */