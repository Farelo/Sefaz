const express = require('express')
const router = express.Router()
const reports_controller = require('./reports.controller')
const auth = require('../../security/auth.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')

router.get('/home', reports_controller.home_report)
router.get('/home/low_battery', reports_controller.home_low_battery_report)
router.get('/home/permanence_time_exceeded', reports_controller.home_permanence_time_exceeded_report)
router.get('/general', reports_controller.general_report)
router.get('/general_inventory', reports_controller.general_inventory_report)
router.get('/absent', reports_controller.absent_report)
router.get('/permanence_time', reports_controller.permanence_time_report)
router.get('/battery', reports_controller.battery_report)
router.get('/quantity', reports_controller.quantity_report)
router.get('/general_info', reports_controller.general_info_report)
router.get('/clients', reports_controller.clients_report)
router.get('/snapshot', reports_controller.snapshot_report)

module.exports = router

// GET '/home'
/**
 * @swagger
 * /reports/home:
 *   get:
 *     summary: Retrieve reports on database
 *     description: Retrieve general report about all packings
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Reports
 *     parameters:
 *       - name: current_state
 *         description: analise, local_incorreto, local_correto, perdida, sem_sinal
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

// GET '/home/low_battery'
/**
 * @swagger
 * /reports/home/low_battery:
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

// GET '/home/permanence_time_exceeded'
/**
 * @swagger
 * /reports/home/permanence_time_exceeded:
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