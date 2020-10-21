const express = require("express");
const router = express.Router();
const positionsController = require("./positions.controller");
const auth = require("../../security/auth.middleware");

router.get("/", [], positionsController.get);
router.get("/geolocation", [], positionsController.getGeolocation);

module.exports = router;

// GET '/'
/**
 * @swagger
 * /positions:
 *   get:
 *     summary: Retrieve the positions of all devices with position messages in the specified period of time
 *     description: All positions in the period of time. If a period is not specified, then it returns the last 10 results.
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Positions
 *     parameters:
 *       - name: tag
 *         description: Return position filtered by tag code
 *         in: query
 *         required: false
 *         type: string
 *       - name: start_date
 *         description: Start date of period of time. The date is GMT-0 given in the format "YYYY-MM-DDTHH:MM:SS.000Z", example "2020-10-19T22:19:30.000Z".
 *         in: query
 *         required: false
 *         type: string
 *       - name: end_date
 *         description: End date of period of time. The date is GMT-0 given in the format "YYYY-MM-DDTHH:MM:SS.000Z", example "2020-10-19T22:19:30.000Z".
 *         in: query
 *         required: false
 *         type: string
 *       - name: accuracy
 *         description: Max accuracy to return in meters. Default 32000.
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

// GET '/geolocation'
/**
 * @swagger
 * /positions/geolocation:
 *   get:
 *     summary: Retrieve the last positions of all devices
 *     description: The last position of all devices that attend to a criteria set
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Positions
 *     parameters:
 *       - name: company_id
 *         description: Return position filtered by tag code
 *         in: path
 *         required: false
 *         type: string
 *       - name: family_id
 *         description: Start date of period of time
 *         in: query
 *         required: false
 *         type: string
 *       - name: serial
 *         description: End date of periodo of time
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