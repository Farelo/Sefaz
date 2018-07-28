const debug = require('debug')('job:evaluators:evaluates_gc16')

module.exports = async (packing, current_plant, current_department) => {
    try {
        let edited_packing = {}
        if (packing.actual_plant.plant) {

            // Verifica se a embalagem está na planta atual localizada
            packing.actual_plant.plant.equals(current_plant._id) ? 
                edited_packing = fixed(packing, current_plant, current_department) : edited_packing = change(packing, current_plant, current_department)
            
            debug('A porra do pacote foi editado', edited_packing._id)
            return edited_packing
        } else {
            edited_packing = change(packing, current_plant, current_department)
            return edited_packing
        }


        return packing
    } catch (error) {
        debug('Something failed when evaluates gc16')        
        throw new Error(error)
    }
}


const fixed = (packing, current_plant, department) => {
    debug('CAIU NO FIXED!')
    
    // Verifica se o departamento atual existe e se existir ele verifica se está batendo com planta atual
    if (department.name) {
        packing.department = department._id
    } else if (packing.actual_plant && packing.department) {
        if (!packing.actual_plant.plant._id.equals(packing.department.plant)) packing.department = null
    } else {
        packing.department = null
    }
    
    if (current_plant.supplier) {
        if (current_plant.supplier.equals(packing.supplier._id)) {
            if (packing.gc16) {
                packing.actual_gc16 = {
                    days: packing.gc16.supplierStock.ssDays,
                    max: packing.gc16.supplierStock.QuantContainerSsMax,
                    min: packing.gc16.supplierStock.QuantContainerSs,
                }
                debug(`GC16 supplier added to packing: ${packing._id}`)
            }
        }
    } else {
        if (packing.gc16) {
            packing.actual_gc16 = {
                days: packing.gc16.factoryStock.fsDays,
                max: packing.gc16.factoryStock.QuantContainerfsMax,
                min: packing.gc16.factoryStock.QuantContainerfs,
            }
            debug(`GC16 factory added to packing: ${packing._id}`)
        }
    }

    return packing
}

const change = (packing, current_plant, department) => {
    debug('CAIU NO CHANGE!')

    // Verifica se o departamento atual existe e se existir ele verifica se está batendo com planta atual
    if (department.name) {
        packing.department = department._id
    } else if (packing.actual_plant && packing.department) {
        if (!packing.actual_plant.plant._id.equals(packing.department.plant)) packing.department = null
    } else {
        packing.department = null
    }

    if (current_plant.supplier) {
        if (current_plant.supplier.equals(packing.supplier._id)) {
            if (packing.gc16) {
                packing.actual_gc16 = {
                    days: packing.gc16.supplierStock.ssDays,
                    max: packing.gc16.supplierStock.QuantContainerSsMax,
                    min: packing.gc16.supplierStock.QuantContainerSs,
                }
                debug(`GC16 supplier added to packing: ${packing._id}`)
            }
        }
    } else {
        if (packing.gc16) {
            packing.actual_gc16 = {
                days: packing.gc16.factoryStock.fsDays,
                max: packing.gc16.factoryStock.QuantContainerfsMax,
                min: packing.gc16.factoryStock.QuantContainerfs,
            }
            debug(`GC16 factory added to packing: ${packing._id}`)
        }
    }

    packing.actual_plant = {
        plant: current_plant._id,
        local: current_plant.supplier ? 'Supplier' : (current_plant.logistic_operator ? 'Logistic' : 'Factory')
    }
    packing.permanence = {
        amount_days: 0,
        date: new Date().getTime(),
        time_exceeded: false
    }

    return packing
}