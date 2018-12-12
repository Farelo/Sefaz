const express = require('express')
const router = express.Router()
const current_state_history_controller = require('./current_state_history.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')

router.get('/:packing_id', [auth, authz], current_state_history_controller.all)

module.exports = router

// GET '/'
/**
 * @swagger
 * /current_state_history/{packing_id}:
 *   get:
 *     summary: Retrieve all families
 *     description: Retrieve all families on database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - CurrentStateHistory
 *     parameters:
 *       - name: packing_id
 *         description: Return family filtered by tag code
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: list of all families
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
