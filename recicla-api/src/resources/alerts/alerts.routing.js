const express = require('express')
const router = express.Router()
const alerts_controller = require('./alerts.controller')
const auth = require('../../security/auth.middleware')

router.get('/', auth, alerts_controller.all)
router.get('/:family_id/:current_state', auth, alerts_controller.all_by_family)

module.exports = router

// GET '/'
/**
 * @swagger
 * /alerts:
 *   get:
 *     summary: Retrieve alerts on database
 *     description: Retrieve alerts about all packings
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Alerts
 *     responses:
 *       200:
 *         description: list of all reports
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/'
/**
 * @swagger
 * /alerts/{family_id}/{current_state}:
 *   get:
 *     summary: Retrieve alerts on database
 *     description: Retrieve alerts about all packings
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Alerts
 *     parameters:
 *       - name: family_id
 *         description: family_id
 *         in: path
 *         required: true
 *         type: string
 *       - name: current_state
 *         description: current_state
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: list of all reports
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */