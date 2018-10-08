const express = require('express')
const router = express.Router()
const users_controller = require('./users.controller')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_user } = require('./users.model')

router.post('/sign_in', validate_joi(validate_user), users_controller.sign_in)
router.get('/', users_controller.all)
router.get('/:id', validate_object_id, users_controller.show)
router.post('/', validate_joi(validate_user), users_controller.create)
router.patch('/:id', [validate_object_id, validate_joi(validate_user)], users_controller.update)
router.delete('/:id', validate_object_id, users_controller.delete)

module.exports = router

/**
 * @swagger
 *
 * /api/users/sign_in:
 *   post:
 *     summary: Authenticate
 *     description: Authenticate a user to be logged in
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/UserObject'
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

// GET '/'
/**
 * @swagger
 *
 * /api/users:
 *   get:
 *     summary: All users
 *     description: Return all users
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User is valid request
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *
 */

// GET '/:id'
/**
 * @swagger
 *
 * /api/users/{id}:
 *   get:
 *     summary: Show a user
 *     description: Show a user by id
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User is valid request
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
 * /api/users:
 *   post:
 *     summary: Create a user
 *     description: Create a user to be logged in
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/UserObject'
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


// PATCH '/:id'
/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Update a user
 *     description: Update a user by id
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         description: User id
 *         in: path
 *         required: true
 *         type: string
 *       - name: user
 *         description: User object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/UserObject'
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
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Remove a user
 *     description:  Remove a user by id
 *     parameters:
 *       - name: id
 *         description: User id
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
 *   UserObject:
 *     type: object
 *     required:
 *       - email
 *       - password
 *       - company
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       company:
 *         type: string
 */