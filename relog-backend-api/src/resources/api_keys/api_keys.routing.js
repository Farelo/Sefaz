const express = require("express");
const router = express.Router();
const apiKeysController = require("./api_keys.controller");
const auth = require("../../security/auth.middleware");
const authz = require("../../security/authz.middleware");
const validate_object_id = require("../../middlewares/validate_object_id.middleware");
const validate_joi = require("../../middlewares/validate_joi.middleware");
const { validate_api_keys } = require("./api_keys.model");

router.get("/", [], apiKeysController.all);
router.get("/:id", [], apiKeysController.show);
router.post("/", [], apiKeysController.create);
router.patch("/:id", [], apiKeysController.update);
router.delete("/:id", [], apiKeysController.delete);

module.exports = router;

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
 *       - API Keys
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
 * /api_keys/{id}:
 *   patch:
 *     summary: Update a api key
 *     description: Update a api key by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - API Keys
 *     parameters:
 *       - name: id
 *         description: Api key id
 *         in: path
 *         required: true
 *         type: string
 *       - name: company
 *         description: Company object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/APIKeyObject'
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
