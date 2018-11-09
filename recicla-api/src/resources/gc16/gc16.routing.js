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
 *         description: GC16 id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: GC16 is valid request
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
 *         description: GC16 object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/GC16Object'
 *     responses:
 *       200:
 *         description: GC16 is valid request
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
 *         description: GC16 id
 *         in: path
 *         required: true
 *         type: string
 *       - name: gc16
 *         description: GC16 object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/GC16Object'
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
 *         description: GC16 id
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
 *   GC16Object:
 *     type: object
 *     required:
 *       - family
 *     properties:
 *       annual_volume:
 *         type: number
 *       capacity:
 *         type: number
 *       productive_days:
 *         type: number
 *       container_days:
 *         type: number
 *       family:
 *         type: string
 *       security_factor:
 *         $ref: '#/definitions/SecurityFactorObject'
 *       frequency:
 *         $ref: '#/definitions/FrequencyObject'
 *       transportation_going:
 *         $ref: '#/definitions/TransportationGoingObject'
 *       transportation_back:
 *         $ref: '#/definitions/TransportationBackObject'
 *       owner_stock:
 *         $ref: '#/definitions/OwnerStockObject'
 *       client_stock:
 *         $ref: '#/definitions/ClientStockObject'
 */

 /**
 * @swagger
 *
 * definitions:
 *   SecurityFactorObject:
 *     type: object
 *     properties:
 *       percentage:
 *         type: number
 *       qty_total_build:
 *         type: number
 *       qty_container:
 *         type: number
 *       
 */

 /**
 * @swagger
 *
 * definitions:
 *   FrequencyObject:
 *     type: object
 *     properties:
 *       days:
 *         type: number
 *       fr:
 *         type: number
 *       qty_total_days:
 *         type: number
 *       qty_container:
 *         type: number
 *       
 */


 /**
 * @swagger
 *
 * definitions:
 *   TransportationGoingObject:
 *     type: object
 *     properties:
 *       days:
 *         type: number
 *       value:
 *         type: number
 *       qty_container:
 *         type: number
 *       
 */

 /**
 * @swagger
 *
 * definitions:
 *   TransportationBackObject:
 *     type: object
 *     properties:
 *       days:
 *         type: number
 *       value:
 *         type: number
 *       qty_container:
 *         type: number
 *       
 */

 /**
 * @swagger
 *
 * definitions:
 *   OwnerStockObject:
 *     type: object
 *     properties:
 *       days:
 *         type: number
 *       value:
 *         type: number
 *       max:
 *         type: number
 *       qty_container:
 *         type: number
 *       qty_container_max:
 *         type: number
 *       
 */

 /**
 * @swagger
 *
 * definitions:
 *   ClientStockObject:
 *     type: object
 *     properties:
 *       days:
 *         type: number
 *       value:
 *         type: number
 *       max:
 *         type: number
 *       qty_container:
 *         type: number
 *       qty_container_max:
 *         type: number
 *       
 */