const express = require('express')
const router = express.Router()
const import_controller = require('./imports.controller')
const auth = require('../../security/auth.middleware')

router.post('/packing_xlsx', auth, import_controller.import_packing)
router.post('/control_point_xlsx', auth, import_controller.import_control_points)

module.exports = router

// POST '/'
/**
 * @swagger
 *
 * /imports/packing_xlsx:
 *   post:
 *     summary: Uploads xlsx file to create packings
 *     description: Uploads xlsx file to create packings
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
 *         name: packing_xlsx
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