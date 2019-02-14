const express = require('express')
const router = express.Router()
const projects_controller = require('./projects.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_projects } = require('./projects.model')

router.get('/', [auth], projects_controller.all)
router.get('/:id', [auth, validate_object_id], projects_controller.show)
router.post('/', [auth, authz, validate_joi(validate_projects)], projects_controller.create)
router.patch('/:id', [auth, authz, validate_object_id, validate_joi(validate_projects)], projects_controller.update)
router.delete('/:id', [auth, authz, validate_object_id], projects_controller.delete)

module.exports = router

// GET '/'
/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Retrieve all projects
 *     description: Retrieve all projects on database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Projects
 *     parameters:
 *       - name: name
 *         description: Return project filtered by name
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: list of all projects
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/:id'
/**
 * @swagger
 *
 * /projects/{id}:
 *   get:
 *     summary: Create a project
 *     description: Create a project
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Projects
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Project id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Project is valid request
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
 * /projects:
 *   post:
 *     summary: Create a project
 *     description: Create a project
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Projects
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: project
 *         description: Project object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/ProjectObject'
 *     responses:
 *       200:
 *         description: Project is valid request
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
 * /projects/{id}:
 *   patch:
 *     summary: Update a project
 *     description: Update a project by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Projects
 *     parameters:
 *       - name: id
 *         description: Project id
 *         in: path
 *         required: true
 *         type: string
 *       - name: project
 *         description: Project object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/ProjectObject'
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
 * /projects/{id}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Projects
 *     summary: Delete a project
 *     description: Deleta a project
 *     parameters:
 *       - name: id
 *         description: Project id
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
 *   ProjectObject:
 *     type: object
 *     required:
 *       - name
 *     properties:
 *       name:
 *         type: string
 */