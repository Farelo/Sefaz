const express = require('express')
const router = express.Router()
const control_points_controller = require('./control_points.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_control_points } = require('./control_points.model')

router.get('/', [auth, authz], control_points_controller.all)
router.get('/:id', [auth, authz, validate_object_id], control_points_controller.show)
router.post('/', [auth, authz, validate_joi(validate_control_points)], control_points_controller.create)
router.patch('/:id', [auth, authz, validate_object_id, validate_joi(validate_control_points)], control_points_controller.update)
router.delete('/:id', [auth, authz, validate_object_id], control_points_controller.delete)

module.exports = router

// GET '/'
/**
 * @swagger
 * /control_points:
 *   get:
 *     summary: Retrieve all control points
 *     description: Retrieve all control points on database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - ControlPoints
 *     parameters:
 *       - name: name
 *         description: Return control point filtered by name
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: list of all control_points
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/:id'
/**
 * @swagger
 *
 * /control_points/{id}:
 *   get:
 *     summary: Create a control point
 *     description: Create a control point
 *     security:
 *       - Bearer: []
 *     tags:
 *       - ControlPoints
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ControlPoint id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: ControlPoint is valid request
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
 * /control_points:
 *   post:
 *     summary: Create a control point
 *     description: Create a control point
 *     security:
 *       - Bearer: []
 *     tags:
 *       - ControlPoints
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: control_point
 *         description: ControlPoint object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/ControlPointObject'
 *     responses:
 *       200:
 *         description: ControlPoint is valid request
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
 * /control_points/{id}:
 *   patch:
 *     summary: Update a control point
 *     description: Update a control point by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - ControlPoints
 *     parameters:
 *       - name: id
 *         description: ControlPoint id
 *         in: path
 *         required: true
 *         type: string
 *       - name: control_point
 *         description: ControlPoint object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/ControlPointObject'
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
 * /control_points/{id}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - ControlPoints
 *     summary: Delete a control point
 *     description: Deleta a control point
 *     parameters:
 *       - name: id
 *         description: ControlPoint id
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
 *   ControlPointObject:
 *     type: object
 *     required:
 *       - name
 *     properties:
 *       name:
 *         type: string
 *       geofence:
 *         $ref: '#/definitions/GeofenceObject'
 *       full_address:
 *         type: string
 *       type:
 *         type: string
 *       company:
 *         type: string
 */

 /**
 * @swagger
 *
 * definitions:
 *   GeofenceObject:
 *     type: object
 *     properties:
 *       coordinates:
 *         $ref: '#/definitions/GeofenceCoordinatesObject'
 *       type:
 *         type: number
 *       radius:
 *         type: number
 */

 /**
 * @swagger
 *
 * definitions:
 *   GeofenceCoordinatesObject:
 *     type: array
 *     items:
 *       type: object
 *       properties:
 *         lat:
 *           type: number
 *         lng:
 *           type: number
 */