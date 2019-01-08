const { Packing } = require('../models/packings.model')
const { DeviceData } = require('../models/device_data.model')

let script = async () => {

    try {
        //obter os packings sem last_device_data_battery
        const packings = await Packing.find({'last_device_data_battery': {$exists: false}})
        
        let errors = 0
        let docs = 0

        console.log(`total de packings sem battery: ${packings.length}`)

        await packings.forEach(async packing => {

            try {
                let last_device_data_battery = await DeviceData.find({'device_id': packing.tag.code, 'battery.percentage': {$ne: null}}/* , null, { 'message_date': {$sort: 1} } */).limit(1)
    
                await Packing.findByIdAndUpdate(packing._id, {last_device_data_battery: last_device_data_battery[0]._id}, {new: true}, (err, doc, res) => {

                    if (err) {
                        errors++
                        console.log(`docs: ${errors}`)
                        console.log(`callback error: ${err}`)
                    }

                    if (doc) {
                        docs++
                        console.log(`docs: ${docs}`)
                        // console.log(`callback doc: ${doc}`)
                    }
                })
                
            } catch (error) {
                console.log(`Erro ao atualizar o packing ${packing.tag.code} com info de bateria do dia ${last_device_data_battery.message_date}`)
            }
        })

    } catch (error) {
        console.log(`deu ruim ${error}`)
    }
}

module.exports = script