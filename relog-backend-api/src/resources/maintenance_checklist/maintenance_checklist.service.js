const e = require("cors");
const _ = require('lodash')
const { Maintenance_checklist } = require("./maintenance_checklist.model")

exports.create_maintenance_checklist = async (data) => {
    try {
        
        var new_maintenance_checklist = new Maintenance_checklist(data)
        await new_maintenance_checklist.save()

        return new_maintenance_checklist
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_id = async (id) => {
    try {
        var maintenance_checklist = await Maintenance_checklist.findById(id).where({ excluded_at: { $exists: false }})
        return maintenance_checklist
    } catch (error) {
        throw new Error(error)
    }
}


