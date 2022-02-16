const express = require('express')
const router = express.Router()
const work_hours_controller = require('./work_hours.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')
const { validate_work_hours } = require('./work_hours.model')

//router.post('/', integration_controller.create_IntegrationId);
router.get('/', [auth], work_hours_controller.all)
router.patch('/:id', [auth, authz, validate_joi(validate_work_hours)], work_hours_controller.update)
router.delete('/:id', [auth, authz ], work_hours_controller.delete)


module.exports = router;


// POST '/'
/**
 * @swagger
 *
 * /work_hours:
 *   post:
 *     summary: work hours of racks
 *     description: Work hours of racks
 *     tags:
 *       - WorkHour
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description:  valid request
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *
 */

// GET '/'
/**
 * @swagger
 * /work_hours:
 *   get:
 *     summary: Retrieve all Work hours of a rack
 *     description: Retrieve all Work hours on database
 *     security:
 *       - Bearer: []
 *     tags:
 *       - WorkHour
 *     parameters:
 *       - name: Id
 *         description: Return all Work hours filtered by Id
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: list of all Work hours
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// PATCH '/:id'
/**
 * @swagger
 * /work_hours/{id}:
 *   patch:
 *     summary: Update a Work_hours
 *     description: Update a Work_hours by id
 *     security:
 *       - Bearer: []
 *     tags:
 *       - WorkHour
 *     parameters:
 *       - name: id
 *         description: Work_hours id
 *         in: path
 *         required: true
 *         type: string
 *       - name: work_hours
 *         description: Work_hours object
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Work_hourObject'
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// DELETE '/'
/**
 * @swagger
 * /work_hours/{id}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - WorkHour
 *     summary: Delete a work_hours
 *     description: Delete a work_hours
 *     parameters:
 *       - name: id
 *         description: Work_hours id
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

/**
 * @swagger
 *
 * definitions:
 *   Work_hourObject:
 *     type: object
 *     required:
 *       - id
 *     properties:
 *       work_end:
 *         type: string
 *         format: date
 *         example: 2021-10-24T22:55:38.916+00:00
 *       id_rack:
 *         type: string
 *       work_start:
 *          type: string
 *          format: date
 *          example: 2021-10-24T22:55:38.916+00:00
 *       last_work_duration:
 *          type: string
 *          format: date
 *          example: 2021-10-24T22:55:38.916+00:00
 *       total_work_duration:
 *          type: string
 *          format: date
 *          example: 2021-10-24T22:55:38.916+00:00
 */