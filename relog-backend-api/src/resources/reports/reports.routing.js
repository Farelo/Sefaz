const express = require('express')
const router = express.Router()
const reports_controller = require('./reports.controller')
const auth = require('../../security/auth.middleware')

router.get('/general', auth, reports_controller.general_report)
router.get('/general_inventory', auth, reports_controller.general_inventory_report)
router.get('/absent', auth, reports_controller.absent_report)
router.get('/permanence_time', auth, reports_controller.permanence_time_report)
router.get('/battery', auth, reports_controller.battery_report)
router.get('/quantity', auth, reports_controller.quantity_report)
router.get('/general_info', auth, reports_controller.general_info_report)
router.get('/clients', auth, reports_controller.clients_report)
router.get('/snapshot', auth, reports_controller.snapshot_report)
router.get('/snapshot_recovery', auth, reports_controller.snapshot_recovery_report)
router.get('/owner_supplier_absent', auth, reports_controller.owner_supplier_absent)

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

// GET '/general_inventory'
/**
 * @swagger
 * /reports/general_inventory:
 *   get:
 *     summary: Retrieve reports on database
 *     description: Retrieve general inventory report about all packings
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

// GET '/permanence_time'
/**
 * @swagger
 * /reports/permanence_time:
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
 *     responses:
 *       200:
 *         description: list of all reports
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/battery'
/**
 * @swagger
 * /reports/battery:
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
 *     responses:
 *       200:
 *         description: list of all reports
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/quantity'
/**
 * @swagger
 * /reports/quantity:
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
 *     responses:
 *       200:
 *         description: list of all reports
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/general_info'
/**
 * @swagger
 * /reports/general_info:
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
 *     responses:
 *       200:
 *         description: list of all reports
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/clients'
/**
 * @swagger
 * /reports/clients:
 *   get:
 *     summary: Retrieve reports on database
 *     description: Retrieve general report about all packings
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Reports
 *     parameters:
 *       - name: company
 *         description: Return info filtered by company
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

// GET '/snapshot_recovery'
/**
 * @swagger
 * /reports/snapshot_recovery:
 *   get:
 *     summary: Retrieve reports on database
 *     description: Recover historical snapshot report about all packings
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Reports
 *     parameters:
 *       - name: snapshot_date
 *         description: The moment of the snapshot
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: historical snapshot
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */


// GET '/owner_supplier_absent'
/**
 * @swagger
 * /reports/owner_supplier_absent:
 *   get:
 *     summary: Retrieve reports on database
 *     description: Retrieve informations abount packings out owner or supplier at least 30 days
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Reports
 *     responses:
 *       200:
 *         description: list of all packings
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */