const logger = require('../config/winston.config')


const parserMessage = async (jsonMessage, deviceData) => {
    logger.info("DeviceData to update BEFORE parser: "+deviceData);

    let key = Object.keys(jsonMessage)[0];
    logger.info("Message type: "+key);
    

    switch(key){
        case "location":
            deviceData.latitude = jsonMessage.location.latitude
            deviceData.longitude = jsonMessage.location.longitude
            deviceData.accuracy = jsonMessage.location.accuracy
            break;
        case "analog":
            let port = jsonMessage.port
            switch(port){
                case "102":
                    deviceData.temperature = jsonMessage.analog.value
                    break;
                case "103":
                    deviceData.battery.voltage = jsonMessage.analog.value
                    break;
                case "200":
                    deviceData.battery.voltage = jsonMessage.analog.value
                    break;
            }
            break;
        case "networkInformation":
            deviceData.seq_number = jsonMessage.networkInformation.sequenceNumber
            break;
    }

    deviceData.messate_date = new Date(jsonMessage.timestamp)
    deviceData.message_date_timestamp = jsonMessage.timestamp
    deviceData.message = JSON.stringify(jsonMessage)

    logger.info("DeviceData to update AFTER parser: "+deviceData);

    return deviceData
}

exports.parserMessage = parserMessage