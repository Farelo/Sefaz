const express = require('express')
const router = express.Router()
const families_controller = require('./families.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_families } = require('./families.model')

router.get('/', [auth], families_controller.all)
router.get('/:id', [auth, validate_object_id], families_controller.show)
router.post('/', [auth, authz, validate_joi(validate_families)], families_controller.create)
router.patch('/:id', [auth, authz, validate_object_id, validate_joi(validate_families)], families_controller.update)
router.delete('/:id', [auth, authz, validate_object_id], families_controller.delete)
router.patch('/insert_item/:id', [auth, authz, validate_object_id], families_controller.insert_item)
router.patch('/remove_item/:id', [auth, authz, validate_object_id], families_controller.remove_item)

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
 *       - Families
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
 *     summary: Get a family
 *     description: Get a family
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Families
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
 *       - Families
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
 *       - Families
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
 *       - Families
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

// INSERT ITEM '/'
/**
 * @swagger
 * /families/insert_item/{id}:
 *   patch:
 *     summary: Update a family array item
 *     description: Add an item id to the family
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Families
 *     parameters:
 *       - name: id
 *         description: Family id
 *         in: path
 *         required: true
 *         type: string
 *       - name: family
 *         description: Item object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/ItemObject'
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// DELETE ITEM'/'
/**
 * @swagger
 * /families/remove_item/{id}:
 *   patch:
 *     summary: Update a family array item
 *     description: Remove an item id from the family
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Families
 *     parameters:
 *       - name: id
 *         description: Family id
 *         in: path
 *         required: true
 *         type: string
 *       - name: family
 *         description: Item object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/ItemObject'
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
 *       - rack_items
 *     properties:
 *       code:
 *         type: string
 *       company:
 *         type: string
 *       rack_items:
 *         type: array
 *         items: 
 *          type: string
 *       
 */

 /**
 * @swagger
 *
 * definitions:
 *   ItemObject:
 *     type: object
 *     required:
 *       - item_id
 *     properties:
 *       item_id:
 *         type: string
 *       
 */