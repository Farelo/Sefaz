const express = require('express')
const router = express.Router()
const racks_controller = require('./racks.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_racks } = require('./racks.model')

router.get('/', [auth], racks_controller.all)
router.get('/:id', [auth, validate_object_id], racks_controller.show)
router.post('/', [auth, authz, validate_joi(validate_racks)], racks_controller.create)
router.post('/create_many', [auth, authz], racks_controller.create_many)
router.patch('/:id', [auth, authz, validate_object_id, validate_joi(validate_racks)], racks_controller.update)
router.delete('/:id', [auth, authz, validate_object_id], racks_controller.delete)
router.get('/on_control_point/:control_point_id', [auth], racks_controller.show_racks_on_control_point)
router.get('/check_device/:device_id', [auth], racks_controller.check_device)
router.get('/data/geolocation', [auth], racks_controller.geolocation)

module.exports = router

// GET '/'
/**
 * @swagger
 * /racks:
 *   get:
 *     summary: Retrieve all racks
 *     description: Retrieve all racks on database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Racks
 *     parameters:
 *       - name: tag_code
 *         description: Return rack filtered by tag code
 *         in: query
 *         required: false
 *         type: string
 *       - name: family
 *         description: Return rack filtered by family
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: list of all racks
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/:id'
/**
 * @swagger
 *
 * /racks/{id}:
 *   get:
 *     summary: Create a rack
 *     description: Create a rack
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Racks
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Rack id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Rack is valid request
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
 * /racks:
 *   post:
 *     summary: Create a rack
 *     description: Create a rack
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Racks
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: rack
 *         description: Rack object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/RackObject'
 *     responses:
 *       200:
 *         description: Rack is valid request
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
 * /racks/create_many:
 *   post:
 *     summary: Create a rack
 *     description: Create a rack
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Racks
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: rack
 *         description: Rack array
 *         in: body
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *     responses:
 *       200:
 *         description: Rack is valid request
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
 * /racks/{id}:
 *   patch:
 *     summary: Update a rack
 *     description: Update a rack by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Racks
 *     parameters:
 *       - name: id
 *         description: Rack id
 *         in: path
 *         required: true
 *         type: string
 *       - name: rack
 *         description: Rack object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/RackObject'
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
 * /racks/{id}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Racks
 *     summary: Delete a rack
 *     description: Delete a rack
 *     parameters:
 *       - name: id
 *         description: Rack id
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
 * /racks/on_control_point/{control_point_id}:
 *   get:
 *     summary: Retrieve racks on a current control point
 *     description: Retrieve racks on a current control point
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Racks
 *     parameters:
 *       - name: control_point_id
 *         description: Return racks on a current control point
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
 * /racks/check_device/{device_id}:
 *   get:
 *     summary: Check if racks exists in loka's database
 *     description: Check if racks exists in loka's database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Racks
 *     parameters:
 *       - name: device_id
 *         description: Check if racks exists in loka's database
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
 * /racks/data/geolocation:
 *   get:
 *     summary: Retrieve reports on database
 *     description: Retrieve general report about all racks
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Racks
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
 *       - name: rack_serial
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
 *
 * definitions:
 *   RackObject:
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
 *       fabricationDate:
 *         type: date
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