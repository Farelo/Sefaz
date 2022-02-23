const express = require('express')
const router = express.Router()
const rack_item_controller = require('./racks_items.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_RackItem } = require('./racks_items.model')

router.get('/', [auth], rack_item_controller.all)
router.post('/', [auth, authz, validate_joi(validate_RackItem)], rack_item_controller.create)
router.patch('/:id', [auth, authz, validate_object_id, validate_joi(validate_RackItem)], rack_item_controller.update)
router.patch('/update_price/:id', [auth, authz, validate_object_id], rack_item_controller.update_price)
router.delete('/:id', [auth, authz, validate_object_id], rack_item_controller.delete)
router.get('/:id',[auth, validate_object_id], rack_item_controller.show)
router.get('/price_history/:id', [auth, validate_object_id], rack_item_controller.get_prices)

module.exports = router


// GET '/'
/**
 * @swagger
 *
 * /rack_items:
 *   get:
 *     summary: All rack items
 *     description: Return all rack items
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Rack items
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: startDate
 *         description: Start date to filter by date (ISO 8601 format)
 *         in: query
 *         required: true
 *         type: string
 *         format: date-time
 *         example: 2022-01-20T00:00:00.000Z
 *       - name: endDate
 *         description: End date to filter by date (ISO 8601 format)
 *         in: query
 *         required: false
 *         type: string
 *         format: date-time    
 *         example: 2022-01-22T00:00:00.000Z 
 *     responses:
 *       200:
 *         description: Racks items is valid request
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *
 */

// GET '/:id'
/**
 * @swagger
 *
 * /rack_items/{id}:
 *   get:
 *     summary: Show a rack item
 *     description: Show a rack item by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Rack items
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Rack item id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Rack item is valid request
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *
 */

/**
 * @swagger
 *
 * /rack_items:
 *   post:
 *     summary: Create a rack item
 *     description: Create a rack item 
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Rack items
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: rack item
 *         description: Rack Item object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/RackItemObject'
 *     responses:
 *       200:
 *         description: Is valid request
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *
 */

// PATCH '/:id'
/**
 * @swagger
 * /rack_items/{id}:
 *   patch:
 *     summary: Update rack item
 *     description: Update the name and description of a rack item by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Rack items
 *     parameters:
 *       - name: id
 *         description: rack item id
 *         in: path
 *         required: true
 *         type: string
 *       - name: rack item
 *         description: Rack item object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/RackItemObjectToUpdate'
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// PATCH '/update_price/:id'
/**
 * @swagger
 * /rack_items/update_price/{id}:
 *   patch:
 *     summary: Update rack item price
 *     description: Update the price of a rack item by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Rack items
 *     parameters:
 *       - name: id
 *         description: rack item id
 *         in: path
 *         required: true
 *         type: string
 *       - name: rack item
 *         description: Rack item object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/RackItemObjectToUpdatePrice'
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

/**
 * @swagger
 * /rack_items/{id}:
 *   delete:
 *     tags:
 *       - Rack items
 *     summary: Remove a rack item
 *     description:  Remove a rack item by id
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         description: Rack item id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/price_history/:id'
/**
 * @swagger
 *
 * /rack_items/price_history/{id}:
 *   get:
 *     summary: Get a rack item price history
 *     description: Get all the price history about a rack item
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Rack items
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Rack item id
 *         in: path
 *         required: true
 *         type: string
 *       - name: startDate
 *         description: Start date to filter by date (ISO 8601 format)
 *         in: query
 *         required: false
 *         type: string
 *         format: date-time
 *         example: 2022-01-20T00:00:00.000Z
 *       - name: endDate
 *         description: End date to filter by date (ISO 8601 format)
 *         in: query
 *         required: false
 *         type: string
 *         format: date-time    
 *         example: 2022-01-22T00:00:00.000Z 
 *     responses:
 *       200:
 *         description: Rack item is valid request
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *
 */

 /**
 * @swagger
 *
 * definitions:
 *   RackItemObject:
 *     type: object
 *     required:
 *       - name
 *       - description
 *       - current_price
 *       - date
 *     properties:
 *       name:
 *         type: string
 *       family_id:
 *         type: string
 *       description:
 *         type: string
 *       current_price:
 *         type: number
 *       date:
 *         type: string 
 *         format: date-time
 *         example: 2022-01-20T00:00:00.000Z
 *        
 */

  /**
 * @swagger
 *
 * definitions:
 *   RackItemObjectToUpdate:
 *     type: object
 *     required:
 *       - name
 *       - description
 *       - photo
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       photo:
 *         type: string
 */

  /**
 * @swagger
 *
 * definitions:
 *   RackItemObjectToUpdatePrice:
 *     type: object
 *     required:
 *       - current_price
 *       - date
 *     properties:
 *       current_price:
 *         type: number
 *       date:
 *         type: string 
 *         format: date-time
 *         example: 2022-01-20T00:00:00.000Z
 */