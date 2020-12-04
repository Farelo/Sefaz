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
         return res.status(HttpStatus.UNAUTHORIZED).send({ message: "Missing Api Key" });
      }
   } catch (e) {
      return res.status(HttpStatus.UNAUTHORIZED).send({ message: "Missing Api Key" });
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
