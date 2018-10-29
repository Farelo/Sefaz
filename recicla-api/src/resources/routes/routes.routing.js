const express = require('express')
const router = express.Router()
const routes_controller = require('./routes.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_routes } = require('./routes.model')

router.get('/', [auth, authz], routes_controller.all)
router.get('/:id', [auth, authz, validate_object_id], routes_controller.show)
router.post('/', [auth, authz, validate_joi(validate_routes)], routes_controller.create)
router.patch('/:id', [auth, authz, validate_object_id, validate_joi(validate_routes)], routes_controller.update)
router.delete('/:id', [auth, authz, validate_object_id], routes_controller.delete)

module.exports = router

// GET '/'
/**
 * @swagger
 * /routes:
 *   get:
 *     summary: Retrieve all routes
 *     description: Retrieve all routes on database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Routes
 *     parameters:
 *       - name: name
 *         description: Return route filtered by name
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: list of all routes
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/:id'
/**
 * @swagger
 *
 * /routes/{id}:
 *   get:
 *     summary: Create a route
 *     description: Create a route
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Routes
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
 * /routes:
 *   post:
 *     summary: Create a route
 *     description: Create a route
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Routes
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: control_point
 *         description: ControlPoint object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/RouteObject'
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
 * /routes/{id}:
 *   patch:
 *     summary: Update a route
 *     description: Update a route by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Routes
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
 *           $ref: '#/definitions/RouteObject'
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
 * /routes/{id}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Routes
 *     summary: Delete a route
 *     description: Deleta a route
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
 *   RouteObject:
 *     type: object
 *     required:
 *       - family
 *       - first_point
 *       - second_point
 *     properties:
 *       family:
 *         type: string
 *       first_point:
 *         type: string
 *       second_point:
 *         type: string
 *       distance:
 *         type: number
 *       duration_time:
 *         type: number
 *       traveling_time:
 *         $ref: '#/definitions/TravelingTimeObject'
 */

 /**
 * @swagger
 *
 * definitions:
 *   TravelingTimeObject:
 *     type: object
 *     properties:
 *       max:
 *         type: string
 *       min:
 *         type: string
 */