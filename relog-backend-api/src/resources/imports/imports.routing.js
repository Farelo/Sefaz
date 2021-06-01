const express = require('express')
const router = express.Router()
const import_controller = require('./imports.controller')
const auth = require('../../security/auth.middleware')

router.post('/rack_xlsx', auth, import_controller.import_rack)
router.post('/control_point_xlsx', auth, import_controller.import_control_points)
router.post('/company_xlsx', auth, import_controller.import_companies)

module.exports = router

// POST '/'
/**
 * @swagger
 *
 * /imports/rack_xlsx:
 *   post:
 *     summary: Uploads xlsx file to create racks
 *     description: Uploads xlsx file to create racks
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Import
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: rack_xlsx
 *         description: The file to upload xlsx
 *         required: true
 *         type: file
 *     responses:
 *       200:
 *         description: Family is valid request
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
 * /imports/control_point_xlsx:
 *   post:
 *     summary: Uploads xlsx file to create control points
 *     description: Uploads xlsx file to create control points
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Import
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: control_point_xlsx
 *         description: The file to upload xlsx
 *         required: true
 *         type: file
 *     responses:
 *       200:
 *         description: Family is valid request
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
 * /imports/company_xlsx:
 *   post:
 *     summary: Uploads xlsx file to create companies
 *     description: Uploads xlsx file to create control points
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Import
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: company_xlsx
 *         description: The file to upload xlsx
 *         required: true
 *         type: file
 *     responses:
 *       200:
 *         description: Family is valid request
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *
 */