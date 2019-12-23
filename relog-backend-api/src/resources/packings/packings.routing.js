const express = require('express')
const router = express.Router()
const packings_controller = require('./packings.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_packings } = require('./packings.model')

router.get('/', [auth], packings_controller.all)
router.get('/:id', [auth, validate_object_id], packings_controller.show)
router.post('/', [auth, authz, validate_joi(validate_packings)], packings_controller.create)
router.post('/create_many', [auth, authz], packings_controller.create_many)
router.patch('/:id', [auth, authz, validate_object_id, validate_joi(validate_packings)], packings_controller.update)
router.delete('/:id', [auth, authz, validate_object_id], packings_controller.delete)
router.get('/on_control_point/:control_point_id', [auth], packings_controller.show_packings_on_control_point)
router.get('/check_device/:device_id', [auth], packings_controller.check_device)
router.get('/data/geolocation', [auth], packings_controller.geolocation)
router.get('/data/control_point/geolocation', [auth], packings_controller.control_point_geolocation)

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
 *       - Packings
 *     parameters:
 *       - name: tag_code
 *         description: Return packing filtered by tag code
 *         in: query
 *         required: false
 *         type: string
 *       - name: family
 *         description: Return packing filtered by family
 *         in: query
 *         required: false
 *         type: string
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
 *     description: Create a packing
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Packings
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
 *     description: Create a packing
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Packings
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

// POST '/'
/**
 * @swagger
 *
 * /packings/create_many:
 *   post:
 *     summary: Create a packing
 *     description: Create a packing
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Packings
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: packing
 *         description: Packing array
 *         in: body
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
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
 *       - Packings
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
 *       - Packings
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
 * /packings/on_control_point/{control_point_id}:
 *   get:
 *     summary: Retrieve packings on a current control point
 *     description: Retrieve packings on a current control point
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Packings
 *     parameters:
 *       - name: control_point_id
 *         description: Return packings on a current control point
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: list of all reports
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

 /**
 * @swagger
 * /packings/check_device/{device_id}:
 *   get:
 *     summary: Check if packings exists in loka's database
 *     description: Check if packings exists in loka's database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Packings
 *     parameters:
 *       - name: device_id
 *         description: Check if packings exists in loka's database
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: list of all reports
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/'
/**
 * @swagger
 * /packings/data/geolocation:
 *   get:
 *     summary: Retrieve reports on database
 *     description: Retrieve general report about all packings
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Packings
 *     parameters:
 *       - name: company_id
 *         description: Filter localization
 *         in: query
 *         required: false
 *         type: string
 *       - name: family_id
 *         description: Filter localization
 *         in: query
 *         required: false
 *         type: string
 *       - name: packing_serial
 *         description: Filter localization
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: list of all reports
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

 /**
 * @swagger
 * /packings/data/control_point/geolocation:
 *   get:
 *     summary: Retrieve reports on database
 *     description: Retrieve general report about all packings based on control points
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Packings
 *     parameters:
 *       - name: start_date
 *         description: Device Data message date
 *         in: query
 *         required: false
 *         type: string
 *       - name: end_date
 *         description: Device Data message date
 *         in: query
 *         required: false
 *         type: string
 *       - name: date
 *         description: Device Data message date
 *         in: query
 *         required: false
 *         type: string
 *       - name: last_hours
 *         description: Device Data message date
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: list of all reports
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