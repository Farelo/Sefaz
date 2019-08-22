const logger = require('../config/winston.config')


const parserMessage = async (jsonMessage, deviceData) => {
    logger.info("DeviceData to update BEFORE parser: "+deviceData);

    let key = Object.keys(jsonMessage)[0];
    logger.info("Message type: "+key);
    
    deviceData.last_communication = new Date(deviceData.message_date_timestamp*1000)
    deviceData.last_communication_timestamp = deviceData.message_date_timestamp
    deviceData.message_date = new Date(jsonMessage.timestamp*1000)
    deviceData.message_date_timestamp = jsonMessage.timestamp
    deviceData.message = JSON.stringify(jsonMessage)

    switch(key){
        case "location":
            deviceData.latitude = jsonMessage.location.latitude
            deviceData.longitude = jsonMessage.location.longitude
            deviceData.accuracy = jsonMessage.location.accuracy
            break;
        case "analog":
            let port = jsonMessage.analog.port
            console.log("ANALOGGGGG")
            console.log(port)

            switch(port){
                case "102":
                    console.log("10222222222222222")

                    deviceData.temperature = jsonMessage.analog.value
                    console.log(jsonMessage.analog.value)
                    break;
                case "103":
                    console.log("1033333")

                    deviceData.battery.voltage = jsonMessage.analog.value
                    console.log(jsonMessage.analog.value)

                    break;
                case "200":
                    console.log("200000000000")

                    deviceData.battery.percentage = jsonMessage.analog.value
                    console.log(jsonMessage.analog.value)

                    break;
            }
            break;
        case "networkInformation":
            deviceData.seq_number = jsonMessage.networkInformation.sequenceNumber
            break;
        default:
            deviceData = null
    }

    
    logger.info("DeviceData to update AFTER parser: "+deviceData);

    return deviceData
}

exports.parserMessage = parserMessage