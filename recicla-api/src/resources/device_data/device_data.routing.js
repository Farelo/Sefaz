const express = require('express')
const router = express.Router()
const device_data_controller = require('./device_data.controller')
const auth = require('../../security/auth.middleware')
const authz = require('../../security/authz.middleware')
const validate_object_id = require('../../middlewares/validate_object_id.middleware')
const validate_joi = require('../../middlewares/validate_joi.middleware')

router.get('/:deviceId', device_data_controller.all)

//a rota post abaixo precisará existir para o caso de tirarmos o serviço loka deste projeto e deixarmos em um servidor diferente
router.post('/', [auth, authz], device_data_controller.create)

/*
    As funções abaixo não precisam existir agora porem serão úteis no futuro
    quando desenvolvermos o sistema admin dos sistemas clientes.

    Elas permitirão corrigir/deletar registros de device_data a partir do admin
*/
// router.get('/:id', [auth, authz, validate_object_id], device_data_controller.show)
// router.patch('/:id', [auth, authz, validate_object_id], device_data_controller.update)
// router.delete('/:id', [auth, authz, validate_object_id], device_data_controller.delete)

module.exports = router

// GET '/'
/**
 * @swagger
 * /device_data:
 *   get:
 *     summary: Retrieve reports on database
 *     description: Retrieve general report about all packings
 *     security:
 *       - Bearer: []
 *     tags:
 *       - DeviceData
 *     parameters:
 *       - name: deviceId
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