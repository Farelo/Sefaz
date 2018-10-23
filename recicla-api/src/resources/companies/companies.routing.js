const express = require('express')
const router = express.Router()
const companies_controller = require('./companies.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_companies } = require('./companies.model')

router.get('/', [auth, authz],companies_controller.all)
router.get('/:id', [auth, validate_object_id], companies_controller.show)
router.post('/', [auth, authz, validate_joi(validate_companies)], companies_controller.create)
router.patch('/:id', [auth, authz, validate_object_id, validate_joi(validate_companies)], companies_controller.update)
router.delete('/:id', [auth, authz, validate_object_id], companies_controller.delete)

module.exports = router

// GET '/'
/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Retrieve all companies
 *     description: Retrieve all companies on database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Companies
 *     responses:
 *       200:
 *         description: list of all companies
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/:id'
/**
 * @swagger
 *
 * /companies/{id}:
 *   get:
 *     summary: Create a company
 *     description: Crete a company
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Companies
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Company id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Company is valid request
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
 * /companies:
 *   post:
 *     summary: Create a company
 *     description: Crete a company
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Companies
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: company
 *         description: Company object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/CompanyObject'
 *     responses:
 *       200:
 *         description: Company is valid request
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
 * /companies/{id}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Companies
 *     summary: Delete a company
 *     description: Deleta a company
 *     parameters:
 *       - name: id
 *         description: Company id
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
 *   CompanyObject:
 *     type: object
 *     required:
 *       - name
 *     properties:
 *       name:
 *         type: string
 *       phone:
 *         type: string
 *       cnpj:
 *         type: string
 *       address:
 *         $ref: '#/definitions/AddressObject'
 *       type:
 *         type: string
 *       
 */

 /**
 * @swagger
 *
 * definitions:
 *   AddressObject:
 *     type: object
 *     properties:
 *       city:
 *         type: string
 *       street:
 *         type: string
 *       cep:
 *         type: string
 *       uf:
 *         type: string
 *       
 */