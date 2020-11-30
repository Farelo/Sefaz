const express = require('express')
const router = express.Router()
const logs_controller = require('./logs.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')

router.get('/', [auth], logs_controller.all)
// router.post('/', [auth], logs_controller.create)
router.post('/', logs_controller.create)

module.exports = router


// GET '/'
/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Retrieve logs database
 *     description: Retrieve logs database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Logs
 *     responses:
 *       200:
 *         description: list of all logs
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// POST '/'
/**
 * @swagger
 * /logs:
 *   post:
 *     summary: Send data to datebase
 *     description: Send data to datebase
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Logs
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: logObject
 *         description: logObject
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/LogObject'
 *     responses:
 *       200:
 *         description: data saved in database
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */


  /**
 * @swagger
 *
 * definitions:
 *   LogObject:
 *     type: object
 *     required:
 *       - user
 *       - log
 *     properties:
 *       user:
 *         type: string
 *       log:
 *         type: string
 */
