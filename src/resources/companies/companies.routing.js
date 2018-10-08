const express = require('express')
const router = express.Router()
const companies_controller = require('./companies.controller')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_companies } = require('./companies.model')

router.get('/', companies_controller.all)
router.get('/:id', validate_object_id, companies_controller.show)
router.post('/', validate_joi(validate_companies), companies_controller.create)
router.patch('/:id', [validate_object_id, validate_joi(validate_companies)], companies_controller.update)
router.delete('/:id', validate_object_id, companies_controller.delete)

module.exports = router

// GET '/'
/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Retrieve all companies
 *     description: Retrieve all companies on database
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
 * /api/companies/{id}:
 *   get:
 *     summary: Create a company
 *     description: Crete a company
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
 * /api/companies:
 *   post:
 *     summary: Create a company
 *     description: Crete a company
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
 * /api/companies/{id}:
 *   patch:
 *     summary: Update a company
 *     description: Update a company by id
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
 * /api/companies/{id}:
 *   delete:
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
 *       
 */