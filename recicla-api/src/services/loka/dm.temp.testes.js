const debug = require('debug')('loka-service')
const dm_controller = require('./dm.controller')
const dm_service = require('./dm.service')

module.exports = {

    test_login: test_login,
    test_messages: test_messages,
    test_positions: test_positions,
    test_deviceById: test_deviceById,
    test_devices_list: test_devices_list,
    test_confirmDevice: test_confirmDevice
    // ,
    // test_getDeviceDataFromMidd: test_getDeviceDataFromMidd

}

async function test_login() {
    // dm_service.loginLokaDmApi().then(cookie => debug("teste de login test-dm-api.js: cookie recebido: " + cookie));

    const cookie = await dm_service.loginLokaDmApi()    
    
    debug( cookie)

}

async function test_messages() {

    const deviceId = 5041756;
    const startDate = '2018-10-01 00:00:00';
    const endDate = '2018-10-02 23:00:00';
    const max = 2;

    // dm_service.loginLokaDmApi().then(cookie => dm_service.messagesFromSigfox(cookie, deviceId, '', '', max)).then(data => console.log(data));
    let cookie = await dm_service.loginLokaDmApi()
    let messagesFromSigfox = await dm_service.messagesFromSigfox(cookie, deviceId, '', '', max)
    
    // await dm_service.messagesFromSigfox(cookie, deviceId, '', '', max).then(data => console.log(data))
    // console.log(' . . . . . . depois . . . . . . ')
    
    debug(messagesFromSigfox)

}

async function test_positions() {

    const deviceId = '5041193';
    const startDate = '2018-10-01 19:19:03';
    const endDate = '2018-10-02 01:19:53';
    const lowAccuracy = true;
    const max = 2;

    // dm_service.loginLokaDmApi().then(cookie => dm_service.positions( cookie, deviceId, null, lowAccuracy, startDate, endDate  ).then(data => console.log(data)));

    let cookie = await dm_service.loginLokaDmApi()
    let positions = await dm_service.positions( cookie, deviceId, null, lowAccuracy, startDate, endDate  )

    debug(positions)
}

async function test_deviceById() {

    const deviceId = '5040518'

    // dm_service.loginLokaDmApi().then(cookie => dm_service.deviceById(cookie, deviceId).then(data => console.log(data)));

    let cookie = await dm_service.loginLokaDmApi()
    let device = await dm_service.deviceById(cookie, deviceId)

    debug(device)

}

async function test_devices_list() {

    const client = 301;
    const profile = 2995;

    // dm_service.loginLokaDmApi().then(cookie => dm_service.devicesList(cookie, '', profile).then(data => console.log(data)));

    let cookie = await dm_service.loginLokaDmApi()
    let devicesList = await dm_service.devicesList(cookie, '', profile)

    debug(devicesList)

}

async function test_confirmDevice(){

    const deviceId = '5040518';

    // dm_controller.confirmDevice(deviceId)
    //     .then(data => debug('teste: ', data))
    //     .catch(error => debug('teste: ', error));
    let res
    try {
        res = await dm_controller.confirmDevice(deviceId)    
    } catch (error) {
        // throw new Error(error)
    }
    

    debug(res)

}

// async function test_getDeviceDataFromMidd() {
module.exports.test_getDeviceDataFromMidd = async () => {
    // console.log('\ntestando positions . . . \n')

    const deviceId = '5041478';
    const max = 1;
    const startDate = '2018-10-08 10:44:21';
    const endDate = '2018-10-08 16:45:14';

    // dm_controller.getDeviceDataFromMiddleware(deviceId, startDate, endDate, null).then(data => debug(data));

    let res

    try {
        res = await dm_controller.getDeviceDataFromMiddleware(deviceId, startDate, endDate, null)
    } catch (error) {
        console.log(error)
    }

    debug(res)
}

