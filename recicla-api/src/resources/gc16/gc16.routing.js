const express = require('express')
const router = express.Router()
const gc16_controller = require('./gc16.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_gc16 } = require('./gc16.model')

router.get('/', [auth, authz], gc16_controller.all)
router.get('/:id', [auth, authz, validate_object_id], gc16_controller.show)
router.post('/', [auth, authz, validate_joi(validate_gc16)], gc16_controller.create)
router.patch('/:id', [auth, authz, validate_object_id, validate_joi(validate_gc16)], gc16_controller.update)
router.delete('/:id', [auth, authz, validate_object_id], gc16_controller.delete)

module.exports = router

// GET '/'
/**
 * @swagger
 * /gc16:
 *   get:
 *     summary: Retrieve all gc16
 *     description: Retrieve all gc16 on database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - GC16
 *     parameters:
 *       - name: tag_code
 *         description: Return gc16 filtered by tag code
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: list of all gc16
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/:id'
/**
 * @swagger
 *
 * /gc16/{id}:
 *   get:
 *     summary: Create a gc16
 *     description: Create a gc16
 *     security:
 *       - Bearer: []
 *     tags:
 *       - GC16
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
 * /gc16:
 *   post:
 *     summary: Create a gc16
 *     description: Create a gc16
 *     security:
 *       - Bearer: []
 *     tags:
 *       - GC16
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: gc16
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
 * /gc16/{id}:
 *   patch:
 *     summary: Update a gc16
 *     description: Update a gc16 by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - GC16
 *     parameters:
 *       - name: id
 *         description: Packing id
 *         in: path
 *         required: true
 *         type: string
 *       - name: gc16
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
 * /gc16/{id}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - GC16
 *     summary: Delete a gc16
 *     description: Deleta a gc16
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
 *       - serial
 *       - family
 *     properties:
 *       tag:
 *         $ref: '#/definitions/TagObject'
 *       serial:
 *         type: string
 *       type:
 *         type: string
 *       weigth:
 *         type: number
 *       width:
 *         type: number
 *       heigth:
 *         type: number
 *       length:
 *         type: number
 *       capacity:
 *         type: number
 *       observations:
 *         type: string
 *       active:
 *         type: boolean
 *       family:
 *         type: string
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
 *       version:
 *         type: string
 *       manufactorer:
 *         type: string
 *       
 */