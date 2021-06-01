const { Rack } = require('../models/racks.model')
const { DeviceData } = require('../models/device_data.model')

let script = async () => {

    console.log('Iniciando o script para atualização dos racks cujas baterias estejam apresentando o valor zero')

    try {
        //obter os racks sem last_device_data_battery
        const racks = await Rack.find({'last_device_data_battery': {$exists: true}}).populate('last_device_data_battery')
        
        let errors = 0
        let docs = 0

        console.log(`total de racks com last_device_data_battery: ${racks.length}`)
        
        racks_battery_zero = racks.filter(rack => {
            
            return (rack.last_device_data_battery.battery.percentage == 0 || rack.last_device_data_battery.battery.voltage == 0 )
        })
        
        console.log(`total de racks com bateria zerada: ${racks_battery_zero.length}`)
        console.log(`rack com battery zero: ${racks_battery_zero}`)
        
        racks_battery_zero.forEach(async rack => {
            
            try {
                let last_device_data_battery = await DeviceData.find({'device_id': rack.tag.code, $and: [{'battery.percentage':{$ne: null}}, {'battery.percentage':{$ne: 0}}]   }).limit(1)
    
                console.log(`\nlast_device_data_battery com bateria diferente de zero: ${last_device_data_battery}`)
    
                await Rack.findByIdAndUpdate(rack._id, {last_device_data_battery: last_device_data_battery[0]._id}, {new: true}, (err, doc, res) => {
    
                    if (err) {
                        errors++
                        console.log(`docs: ${errors}`)
                        console.log(`callback error: ${err}`)
                    }
    
                    if (doc) {
                        docs++
                        console.log(`docs: ${docs}`)
                        console.log(`doc atualizado constando bateria diferente de zero agora: ${doc}`)
                    }
                })
                
            } catch (error) {
                console.log(`Erro ao atualizar o rack ${rack.tag.code} com info de bateria do dia ${last_device_data_battery.message_date}`)        
            }


        });

    } catch (error) {
        console.log(`deu ruim ${error}`)
    }
}

module.exports = script