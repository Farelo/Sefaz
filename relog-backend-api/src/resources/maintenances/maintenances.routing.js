const express = require('express')
const router = express.Router()
const maintenance_controller = require('./maintenances.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
//const { validate_maintenances } = require('./maintenances.model')

router.get('/', [auth], maintenance_controller.all)
router.get('/:id', [auth, validate_object_id], maintenance_controller.show)
router.post('/', [auth, authz], maintenance_controller.create)
router.patch('/:id', [auth, authz, validate_object_id], maintenance_controller.update)
router.get('/time_report/:id', [auth, authz, validate_object_id], maintenance_controller.get_time_report)
router.get('/historic/maintenance_report',  [auth], maintenance_controller.get_historic)

module.exports = router

// GET '/'
/**
 * @swagger
 * /maintenances:
 *   get:
 *     summary: Retrieve all maintenances
 *     description: Retrieve all maintenances on database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Maintenances
 *     responses:
 *       200:
 *         description: list of all maintenances
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/:id'
/**
 * @swagger
 *
 * /maintenances/{id}:
 *   get:
 *     summary: Get a maintenance
 *     description: Get a maintenance by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Maintenances
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Maintenance id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Maintenance is valid request
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
 * /maintenances:
 *   post:
 *     summary: Create a maintenance
 *     description: Create a maintenance
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Maintenances
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: maintenance
 *         description: Maintenance object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/MaintenanceObject'
 *     responses:
 *       200:
 *         description: Maintenance is valid request
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
 * /maintenances/{id}:
 *   patch:
 *     summary: Update a maintenance
 *     description: Update a maintenance by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Maintenances
 *     parameters:
 *       - name: id
 *         description: Maintenance id
 *         in: path
 *         required: true
 *         type: string
 *       - name: maintenance
 *         description: Maintenance object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/MaintenanceObject'
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/:id'
/**
 * @swagger
 *
 * /maintenances/time_report/{id}:
 *   get:
 *     summary: Get a Working hours report by rack id
 *     description: Working hours report since the last maitenance
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Maintenances
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
 *         description: Maintenance is valid request
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *
 */

// GET '/historic'
/**
 * @swagger
 *
 * /maintenances/historic/maintenance_report:
 *   get:
 *     summary: Get the maintenance report by date and family 
 *     description: Get the maintenance report by date and family 
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Maintenances
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: family_id
 *         description: Family id you want to filter by
 *         in: query
 *         required: false
 *         type: string
 *       - name: startDate
 *         description: Start date to filter by date (ISO 8601 format)
 *         in: query
 *         required: true
 *         type: string
 *         format: date-time
 *         example: 2022-01-20T00:00:00.000Z
 *       - name: endDate
 *         description: End date to filter by date (ISO 8601 format)
 *         in: query
 *         required: false
 *         type: string
 *         format: date-time    
 *         example: 2022-01-22T00:00:00.000Z 
 *     responses:
 *       200:
 *         description: Maintenance is valid request
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *
 */


 /**
 * @swagger
 *
 * definitions:
 *   MaintenanceObject:
 *     type: object
 *     required:
 *       - rack_id
 *       - date
 *     properties:
 *       items:
 *          type: array
 *          items: 
 *              $ref: '#/definitions/ItemObject'
 *       rack_id:
 *         type: string
 *       date:
 *         type: string
 *         format: date
 *         example: 2022-02-02
 *       problem_description:
 *         type: string
 *       solution_description:
 *         type: string
 *       description_photo:
 *         type: array
 *         items:
 *          type: string
 *       rack_photo:
 *         type: string
 *       user_id:
 *         type: string
 *       user_auxiliar1:
 *         type: string
 *       user_auxiliar2:
 *         type: string
 */

 /**
 * @swagger
 *
 * definitions:
 *   ItemObject:
 *     type: object
 *     required:
 *       - item
 *     properties:
 *       item:
 *         type: string
 *       need_maintenance:
 *         type: boolean
 *       
 */