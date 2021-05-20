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
 *         description: Rack is a valid request
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
 *       - name: Rack
 *         description: Rack object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/RackObject'
 *     responses:
 *       200:
 *         description: rack is a valid request
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
 *     summary: Create a racks
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
 *         description: Rack is a valid request
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
 *       model:
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
 *       maxliespan:
 *         type: number
 *       fabricationDate:
 *         type: date
 *         pattern: /([0-9]{4})-(?:[0-9]{2})-([0-9]{2})/
 *         example: "2019-05-17"
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