const { Rack} = require('../models/racks.model')
const { DeviceData } = require('../models/device_data.model')

let script = async () => {
    console.log('Iniciando o script para atualização dos racks que estão sem informação de bateria')
    try {
        //obter os racks sem last_device_data_battery
        const racks = await Rack.find({'last_device_data_battery': {$exists: false}})
        
        let errors = 0
        let docs = 0

        console.log(`total de racks sem battery: ${racks.length}`)

        await racks.forEach(async rack => {

            try {
                let last_device_data_battery = await DeviceData.find({'device_id': rack.tag.code, 'battery.percentage': {$ne: null}}/* , null, { 'message_date': {$sort: 1} } */).limit(1)
    
                await Rack.findByIdAndUpdate(rack._id, {last_device_data_battery: last_device_data_battery[0]._id}, {new: true}, (err, doc, res) => {

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
                console.log(`Erro ao atualizar o rack ${rack.tag.code} com info de bateria do dia ${last_device_data_battery.message_date}`)
            }
        })

    } catch (error) {
        console.log(`deu ruim ${error}`)
    }
}

module.exports = script