const express = require('express')
const router = express.Router()
const families_controller = require('./families.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_families } = require('./families.model')

router.get('/', [auth, authz], families_controller.all)
router.get('/:id', [auth, validate_object_id], families_controller.show)
router.post('/', [auth, authz, validate_joi(validate_families)], families_controller.create)
router.patch('/:id', [auth, authz, validate_object_id, validate_joi(validate_families)], families_controller.update)
router.delete('/:id', [auth, authz, validate_object_id], families_controller.delete)

module.exports = router

// GET '/'
/**
 * @swagger
 * /families:
 *   get:
 *     summary: Retrieve all families
 *     description: Retrieve all families on database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Family
 *     parameters:
 *       - name: code
 *         description: Return family filtered by tag code
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: list of all families
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/:id'
/**
 * @swagger
 *
 * /families/{id}:
 *   get:
 *     summary: Create a family
 *     description: Create a family
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Family
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Family id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Family is valid request
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
 * /families:
 *   post:
 *     summary: Create a family
 *     description: Create a family
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Family
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: family
 *         description: Family object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/FamilyObject'
 *     responses:
 *       200:
 *         description: Family is valid request
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
 * /families/{id}:
 *   patch:
 *     summary: Update a family
 *     description: Update a family by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Family
 *     parameters:
 *       - name: id
 *         description: Family id
 *         in: path
 *         required: true
 *         type: string
 *       - name: family
 *         description: Family object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/FamilyObject'
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
 * /families/{id}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Family
 *     summary: Delete a family
 *     description: Deleta a family
 *     parameters:
 *       - name: id
 *         description: Family id
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
 *   FamilyObject:
 *     type: object
 *     required:
 *       - code
 *       - company
 *     properties:
 *       code:
 *         type: string
 *       company:
 *         type: string
 */