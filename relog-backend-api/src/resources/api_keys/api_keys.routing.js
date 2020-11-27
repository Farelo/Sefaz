const express = require('express')
const router = express.Router()
const apiKeysController = require('./api_keys.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_api_keys } = require('./api_key.model')

router.get('/', [auth],apiKeysController.all)
router.get('/:id', [auth, validate_object_id], apiKeysController.show)
router.post('/', [auth, authz, validate_joi(validate_api_keys)], apiKeysController.create)
router.patch('/:id', [auth, authz, validate_object_id, validate_joi(validate_api_keys)], apiKeysController.update)
router.delete('/:id', [auth, authz, validate_object_id], apiKeysController.delete)

module.exports = router

// GET '/'
/**
 * @swagger
 * /api_keys:
 *   get:
 *     summary: Retrieve all api_keys
 *     description: Retrieve all api_keys on database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - api_keys
 *     responses:
 *       200:
 *         description: list of all api_keys
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/:id'
/**
 * @swagger
 *
 * /api_keys/{id}:
 *   get:
 *     summary: Get a api_key
 *     description: Get a api_key
 *     security:
 *       - Bearer: []
 *     tags:
 *       - API Keys
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: API key id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: OK
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
 * /api_keys:
 *   post:
 *     summary: Create a API key
 *     description: Create a API key
 *     security:
 *       - Bearer: []
 *     tags:
 *       - API Keys
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: api_key
 *         description: API key object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/APIKeyObject'
 *     responses:
 *       200:
 *         description: OK
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
 * /companies/{id}:
 *   patch:
 *     summary: Update a company
 *     description: Update a company by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Companies
 *     parameters:
 *       - name: id
 *         description: Company id
 *         in: path
 *         required: true
 *         type: string
 *       - name: company
 *         description: Company object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/CompanyObject'
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
 * /api_keys/{id}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - API Keys
 *     summary: Delete a API key
 *     description: Delete a API key
 *     parameters:
 *       - name: id
 *         description: API key id
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
 *   APIKeyObject:
 *     type: object
 *     required:
 *       - name
 *     properties:
 *       key:
 *         type: string
 *       name:
 *         type: string
 */
