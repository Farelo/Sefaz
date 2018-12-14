const express = require('express')
const router = express.Router()
const device_data_controller = require('./device_data.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')

router.get('/data', [auth, authz], device_data_controller.geolocation)
router.get('/data/:device_id', [auth, authz], device_data_controller.all)

module.exports = router

// TODO: a rota post abaixo precisará existir para o caso de tirarmos o serviço loka deste projeto e deixarmos em um servidor diferente
// router.post('/', [auth, authz], device_data_controller.create)

// GET '/'
/**
 * @swagger
 * /device_data/data/{device_id}:
 *   get:
 *     summary: Retrieve reports on database
 *     description: Retrieve general report about all packings
 *     security:
 *       - Bearer: []
 *     tags:
 *       - DeviceData
 *     parameters:
 *       - name: device_id
 *         description: Return control point filtered by tag code
 *         in: path
 *         required: true
 *         type: string
 *       - name: start_date
 *         description: Return control point filtered by tag code
 *         in: query
 *         required: false
 *         type: string
 *       - name: end_date
 *         description: Return control point filtered by tag code
 *         in: query
 *         required: false
 *         type: string
 *       - name: accuracy
 *         description: Return control point filtered by tag code
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

// GET '/'
/**
 * @swagger
 * /device_data/data:
 *   get:
 *     summary: Retrieve reports on database
 *     description: Retrieve general report about all packings
 *     security:
 *       - Bearer: []
 *     tags:
 *       - DeviceData
 *     parameters:
 *       - name: company_id
 *         description: Filter localization
 *         in: query
 *         required: false
 *         type: string
 *       - name: family_id
 *         description: Filter localization
 *         in: query
 *         required: false
 *         type: string
 *       - name: packing_serial
 *         description: Filter localization
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