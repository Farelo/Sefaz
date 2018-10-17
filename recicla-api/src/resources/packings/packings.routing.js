const express = require('express')
const router = express.Router()
const packings_controller = require('./packings.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_packings } = require('./packings.model')

router.get('/', [auth, authz], packings_controller.all)
// router.get('/:id', [auth, validate_object_id], packings_controller.show)
// router.post('/', [auth, authz, validate_joi(validate_packings)], packings_controller.create)
// router.patch('/:id', [auth, authz, validate_object_id, validate_joi(validate_packings)], packings_controller.update)
// router.delete('/:id', [auth, authz, validate_object_id], packings_controller.delete)

module.exports = router


// GET '/'
/**
 * @swagger
 * /packings:
 *   get:
 *     summary: Retrieve all packings
 *     description: Retrieve all packings on database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Packing
 *     responses:
 *       200:
 *         description: list of all packings
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/:id'
/**
 * @swagger
 *
 * /packings/{id}:
 *   get:
 *     summary: Create a packing
 *     description: Crete a packing
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Packing
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Packing id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Packing is valid request
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
 * /packings:
 *   post:
 *     summary: Create a packing
 *     description: Crete a packing
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Packing
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: packing
 *         description: Packing object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/PackingObject'
 *     responses:
 *       200:
 *         description: Packing is valid request
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
 * /packings/{id}:
 *   patch:
 *     summary: Update a packing
 *     description: Update a packing by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Packing
 *     parameters:
 *       - name: id
 *         description: Packing id
 *         in: path
 *         required: true
 *         type: string
 *       - name: packing
 *         description: Packing object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/PackingObject'
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
 * /packings/{id}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Packing
 *     summary: Delete a packing
 *     description: Deleta a packing
 *     parameters:
 *       - name: id
 *         description: Packing id
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
 *   PackingObject:
 *     type: object
 *     required:
 *       - tag
 *       - serial
 *     properties:
 *       tag:
 *         type: string
 *       serial:
 *         type: string
 */