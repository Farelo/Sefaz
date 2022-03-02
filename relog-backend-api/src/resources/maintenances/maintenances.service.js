const e = require("cors");
const _ = require('lodash')
const { Maintenance } = require("./maintenances.model")

exports.get_all = async (options) => {
    try {
        const data = await Maintenance.find({ excluded_at: { $exists: false }})
       
        return data ? data : []
    } catch (error) {
        throw new Error(error)
    }
} 

exports.create_maitenance = async (data) => {
    try {
        var new_maintenance = new Maintenance(data)
        await new_maintenance.save()

        return new_maintenance
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_id = async (id) => {
    try {
        var maintenance = await Maintenance.findById(id).where({ excluded_at: { $exists: false }})
        return maintenance
    } catch (error) {
        throw new Error(error)
    }
}

exports.update = async (id, data) => {
    try {
        const options = { new: true }
        const new_maintenance = await Maintenance.findByIdAndUpdate(id, data, options)
        return new_maintenance
    } catch (error) {
        throw new Error(error)
    }
}

exports.get_historic_by_id = async (id) => {
    try {
        var maintenance = await Maintenance.findById(id).where({ excluded_at: { $exists: false }})
        return maintenance
    } catch (error) {
        throw new Error(error)
    }
}

exports.get_report = async (rack_id) => {
    try {
        var maintenance = await Maintenance.find()
        .where({ excluded_at: { $exists: false }, rack_id: rack_id})
        .sort({date: -1})

        maintenance = maintenance[0]          /* * the last maintenance * */
        const last_maintenance = maintenance.date.getTime()
        let today = new Date()
        const working_hours = {
            time_since_last_maintenance: msToTime(today - last_maintenance)
        }
        return working_hours
    } catch (error) {
        throw new Error(error)
    }
}

//histórico pelo date e pela família do rack
exports.get_historic = async ( options) => {
    try {
        var start_date = new Date(options.start_date);
        let today = new Date()
        var end_date = options.end_date ? new Date(options.end_date) : today
        end_date.setHours(23, 59, 59)

        var family_id = options.family_id
        var maintenances
        if(family_id == null){
            maintenances = await Maintenance.find({
                excluded_at: { $exists: false },
                date: { $gte: start_date, $lte: end_date }
            })
            .populate("rack_id");
        }
        else{
            maintenances = await Maintenance.find({
                excluded_at: { $exists: false },
                date: { $gte: start_date, $lte: end_date }
            })
            .populate("rack_id", "code family serial type")

            maintenances = maintenances.filter(elem => {
                return (elem.rack_id.family == family_id)
            })
        }
        
        return maintenances
    } catch (error) {
        throw new Error(error)
    }
}

/* exports.delete_rack_item = async (id, rack_edited) => {
    try {
        const options = { new: true }
        const new_rack_item = await RackItem.findByIdAndUpdate(id, rack_edited, options)
        return new_rack_item
    } catch (error) {
        throw new Error(error)
    }
} */


const msToTime = (ms) => {
    let seconds = (ms / 1000).toFixed(1);
    let minutes = (ms / (1000 * 60)).toFixed(1);
    let hours = (ms / (1000 * 60 * 60)).toFixed(1);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) return seconds + " Sec";
    else if (minutes < 60) return minutes + " Min";
    else if (hours < 24) return hours + " Hrs";
    else return days + " Days"
}