const express = require('express')
const router = express.Router()
const maintenance_checklist_controller = require('./maintenance_checklist.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_maintenance_checklist } = require('./maintenance_checklist.model')

router.post('/', [auth, authz, validate_joi(validate_maintenance_checklist)], maintenance_checklist_controller.create)
router.get('/:id', [auth, authz, validate_object_id],maintenance_checklist_controller.show)

module.exports = router

// GET '/:id'
/**
 * @swagger
 *
 * /checklist/{id}:
 *   get:
 *     summary: Show a maintenance checklist
 *     description: Show a maintenance checklist by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Checklist
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Checklist id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Checklist is valid request
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
 * /checklist:
 *   post:
 *     summary: Create a maintenance checklist
 *     description: Create a maintenance checklist 
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Checklist
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: maintenance_checklist
 *         description: Checklist object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Checklist'
 *     responses:
 *       200:
 *         description: Is valid request
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
 *   Checklist:
 *     type: object
 *     required:
 *       - maintenance_id
 *       - items
 *       - photo
 *     properties:
 *       maintenance_id:
 *         type: string
 *       photo:
 *         type: string
 *       items:
 *         type: array
 *         items: 
 *          type: string
 */

