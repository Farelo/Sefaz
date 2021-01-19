const express = require("express");
const router = express.Router();
const HttpStatus = require("http-status-codes");
const callbackController = require("./callbacks.controller");
const apiKeyService = require("../api_keys/api_keys.service");

const authApiKey = async (req, res, next) => {
   let clientApiKey = req.header("APIKEY");
   try {
      if (!clientApiKey) {
         return res.status(HttpStatus.UNAUTHORIZED).send({ message: "Missing Api Key" });
      }

      let isValid = await verifyApiKey(clientApiKey);
      console.log('isValid', clientApiKey, isValid);
      if (isValid) next();
      else {
         return res.status(HttpStatus.UNAUTHORIZED).send({ message: "Invalid Api Key" });
      }
   } catch (e) {
      return res.status(HttpStatus.UNAUTHORIZED).send({ message: "Invalid Api Key" });
   }
};

const verifyApiKey = async (apiKey) => {
   let result = await apiKeyService.findByKey(apiKey);
   return result.length > 0;
};

router.post("/dots", authApiKey, callbackController.dots);

module.exports = router;

// POST '/'
/**
 * @swagger
 *
 * /callbacks/dots:
 *   post:
 *     summary: Receive a dots action
 *     description: Receive a action message from dots actions
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Callback
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: messages
 *         description: Action message
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/AygaActionObject'
 *       - in: header
 *         name: APIKEY
 *         schema:
 *           type: string
 *         required: false
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



 /**
 * @swagger
 *
 * definitions:
 *   AygaActionObject:
 *     type: object
 *     properties: 
 *       deviceUUID:
 *         type: string
 *       signals:
 *         type: array
 *         items:  
 *           type: object
 *           properties:
 *             UUID:
 *               type: string
 *             recovered:
 *               type: boolean 
 *             logs:
 *               type: array
 *               items:
 *                 type: object
 */

 /**
 * @swagger
 *
 * definitions:
 *   GeofenceCoordinatesObject:
 *     type: array
 *     items:
 *       type: object
 *       properties:
 *         lat:
 *           type: number
 *         lng:
 *           type: number
 */