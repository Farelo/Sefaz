const logger = require('./config/winston.config')
var https = require("https");
var WebSocketClient = require("websocket").client;
var client = new WebSocketClient();
const { Packing } = require('./db/models/packings.model')
const {DeviceData, device_data_save} = require('./db/models/device_data.model')
const { parserMessage } = require('./util/parserMessage')

//Authentication Token
//Token of DM
var token = "bb1ab275-2985-461b-8766-10c4b2c4127a"

// Getting Dict DevicesIds x last DeviceData
let deviceDictList
async function getDeviceDictList(){
    await require('./db/db')()
    
    logger.info("Getting Dict DevicesIds x last DeviceData")

    //Getting all DeviceIds
    let result = await Packing.find({}, {_id: 0, tag: 1})
                                .then(packFind =>{
                                    let packMapped = packFind.filter(packFilter => {
                                            return packFilter.tag.code != undefined
                                        }).map(async packMap => {
                                            //Get last deviceData from DB
                                            let lastDeviceData = await DeviceData.find({ 'device_id': packMap.tag.code}).sort( { device_id: 1, message_date: -1 }).limit(1)
                                                                        .then(resultFind =>{
                                                                            return resultFind[0]
                                                                        })
                                            

                                            //Get last deviceData from mock empty
                                            /*
                                            let lastDeviceData = {
                                                device_id: packMap.tag.code,
                                                message_date: null,
                                                message_date_timestamp: null,
                                                message_type: null,
                                                last_communication: null,
                                                last_communication_timestamp: null,
                                                latitude: null,
                                                longitude: null,
                                                accuracy: null,
                                                temperature: null,
                                                seq_number: null,
                                                battery: {
                                                    percentage: null,
                                                    voltage: null
                                                },
                                                message: null
                                            }
                                            */
                                           
                                            let dict = {
                                                deviceId: packMap.tag.code,
                                                lastDeviceData: lastDeviceData
                                            }
                                            return dict
                                        })
                                    
                                    return packMapped
                                })
    deviceDictList = await Promise.all(result)
    return deviceDictList    
}


// Subscribing Devices in Websocket
async function subscribingDeviceIds(deviceDictList){
    logger.info("Subscribing Devices in Websocket")

    deviceDictList.forEach(async deviceDict => {
        logger.info("Subscribing device with id "+deviceDict.deviceId)
        var optionsget = {
            host: "core.loka.systems",
            port: 443,
            path: "/subscribe_terminal/" + deviceDict.deviceId,
            method: "GET",
            headers: { Authorization: "Bearer " + token }
        };
    
        // do the GET request
        var reqGet = https.request(optionsget, function(res) {
            logger.info("Response code on subscribing of device with id "+deviceDict.deviceId+": "+res.statusCode)
            res.on("data", function(d) {
                logger.info("GET result:\n"+d);
            });
        });
    
        reqGet.end();
        reqGet.on("error", function(e) {
            logger.info("Error on subscribing of device with id "+deviceDict.deviceId+": "+e)
            logger.info(e);
        });
    });
}

// Unsubscribing Devices in Websocket
async function unsubscribingDeviceIds(deviceDictList){
    logger.info("Unsubscribing Devices in Websocket")

    deviceDictList.forEach(async deviceDict => {
        logger.info("Unsubscribing device with id "+deviceDict.deviceId)
        var optionsget = {
            host: "core.loka.systems",
            port: 443,
            path: "/unsubscribe_terminal/" + deviceDict.deviceId,
            method: "GET",
            headers: { Authorization: "Bearer " + token }
        };
    
        // do the GET request
        var reqGet = https.request(optionsget, function(res) {
            logger.info("Response code on Unsubscribing of device with id "+deviceDict.deviceId+": "+res.statusCode)
            res.on("data", function(d) {
                logger.info("GET result:\n"+d);
            });
        });
    
        reqGet.end();
        reqGet.on("error", function(e) {
            logger.info("Error on Unsubscribing of device with id "+deviceDict.deviceId+": "+e)
            logger.info(e);
        });
    });
}

// Start and manage the WebSocket
function initWebSocket(){
    client.on("connectFailed", function(error) {
        logger.info("WebSocket Connect Failed: " + error.toString());
    });
    
    client.on("connect", function(connection) {
        logger.info("WebSocket Client Connected");
    
        connection.on("error", function(error) {
            logger.info("WebSocket Connection Error: " + error.toString());
        });
    
        connection.on("close", function() {
            logger.info("WebSocket Echo-protocol Connection Closed");
        });
    
        connection.on("message", async function(message) {
            if (message.type === "utf8") {
                logger.info("WebSocket Received: '" + message.utf8Data + "'");
                
                let jsonMessage = JSON.parse(message.utf8Data)
                
                let deviceDict = deviceDictList.find(function(elem) { 
                    return elem.deviceId==jsonMessage.src; 
                }); 

                let deviceData = deviceDict.lastDeviceData
                
                let deviceDataToSave = await parserMessage(jsonMessage, deviceData)
                if(deviceDataToSave !== null){
                    await device_data_save(deviceDataToSave)
                    deviceData = deviceDataToSave
                }                
            }
        });
    });
    
    client.connect(
        "wss://core.loka.systems/messages",
        null,
        null,
        { Authorization: "Bearer " + token },
        null
    );
}



const runWS = async () => {
    await getDeviceDictList()    
    await subscribingDeviceIds(deviceDictList)
    //await unsubscribingDeviceIds(deviceDictList)
    await initWebSocket()
}

exports.runWS = runWS