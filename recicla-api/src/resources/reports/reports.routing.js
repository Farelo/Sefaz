const express = require('express')
const router = express.Router()
const reports_controller = require('./reports.controller')
const auth = require('../../security/auth.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')

router.get('/', auth, reports_controller.general)

module.exports = router

// GET '/'
/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Retrieve reports on database
 *     description: Retrieve general report about all packings
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Reports
 *     responses:
 *       200:
 *         description: list of all reports
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/:id'
/**
 * @swagger
 *
 * /reports/{id}:
 *   get:
 *     summary: Retrieve reports on database
 *     description: Retrieve general report about all packings
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Reports
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Reports id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Reports is valid request
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *
 */