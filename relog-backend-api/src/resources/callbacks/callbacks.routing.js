const express = require("express");
const router = express.Router();
const callbackController = require("./callbacks.controller");

const authApiKey = async (req, res, next) => {
   let clientApiKey = req.get("APIKEY");
   if (!clientApiKey) {
      return res.status(401).send({
         message: "Missing Api Key",
      });
   }

   try {
      let isValid = await verifyApiKey(clientApiKey);
      if (isValid) {
         next();
      }
   } catch (e) { 
      return res.status(400).send({
         status: false,
         response: "Invalid Api Key"
      });
   }
};

const verifyApiKey = (apiKey) => {
   return true;
}

router.post("/dots", [authApiKey], callbackController.dots);

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
