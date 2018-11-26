const express = require('express')
const router = express.Router()
const reports_controller = require('./reports.controller')
const auth = require('../../security/auth.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')

router.get('/general', reports_controller.general)
router.get('/absent', reports_controller.absent)
router.get('/snapshot', reports_controller.snapshot)

module.exports = router

// GET '/general'
/**
 * @swagger
 * /reports/general:
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

// GET '/absent'
/**
 * @swagger
 * /reports/absent:
 *   get:
 *     summary: Retrieve reports on database
 *     description: Retrieve general report about all packings
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Reports
 *     parameters:
 *       - name: family
 *         description: Return control point filtered by family
 *         in: query
 *         required: false
 *         type: string
 *       - name: serial
 *         description: Return control point filtered by serial
 *         in: query
 *         required: false
 *         type: string
 *       - name: absent_time_in_hours
 *         description: Return control point filtered by absent time
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: list of all reports
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/snapshot'
/**
 * @swagger
 * /reports/snapshot:
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