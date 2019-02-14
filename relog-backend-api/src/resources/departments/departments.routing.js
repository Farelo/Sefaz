const express = require('express')
const router = express.Router()
const departments_controller = require('./departments.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_departments } = require('./departments.model')

router.get('/', [auth], departments_controller.all)
router.get('/:id', [auth, validate_object_id], departments_controller.show)
router.post('/', [auth, authz, validate_joi(validate_departments)], departments_controller.create)
router.patch('/:id', [auth, authz, validate_object_id, validate_joi(validate_departments)], departments_controller.update)
router.delete('/:id', [auth, authz, validate_object_id], departments_controller.delete)

module.exports = router

// GET '/'
/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Retrieve all departments
 *     description: Retrieve all departments on database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Departments
 *     parameters:
 *       - name: name
 *         description: Return department filtered by name
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: list of all departments
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/:id'
/**
 * @swagger
 *
 * /departments/{id}:
 *   get:
 *     summary: Create a department
 *     description: Create a department
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Departments
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Department id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Department is valid request
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
 * /departments:
 *   post:
 *     summary: Create a department
 *     description: Create a department
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Departments
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: control_point
 *         description: Department object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/DepartmentObject'
 *     responses:
 *       200:
 *         description: Department is valid request
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
 * /departments/{id}:
 *   patch:
 *     summary: Update a department
 *     description: Update a department by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Departments
 *     parameters:
 *       - name: id
 *         description: Department id
 *         in: path
 *         required: true
 *         type: string
 *       - name: control_point
 *         description: Department object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/DepartmentObject'
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
 * /departments/{id}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Departments
 *     summary: Delete a department
 *     description: Deleta a department
 *     parameters:
 *       - name: id
 *         description: Department id
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
 *   DepartmentObject:
 *     type: object
 *     required:
 *       - name
 *       - control_point
 *     properties:
 *       name:
 *         type: string
 *       lat:
 *         type: number
 *       lng:
 *         type: number
 *       control_point:
 *         type: string
 */