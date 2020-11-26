const express = require('express')
const router = express.Router()
const callbackController = require('./callbacks.controller')
const auth = require('../../security/auth.middleware')

router.post('/dots', [], callbackController.dots)

module.exports = router

// POST '/'
/**
 * @swagger
 *
 * /callbacks/dots:
 *   post:
 *     summary: Receive a dots action
 *     description: Receive a list of messages from dots actions
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Callback
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: messages
 *         description: Messages array
 *         in: body
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *     responses:
 *       200:
 *         description: It is valid request
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 */