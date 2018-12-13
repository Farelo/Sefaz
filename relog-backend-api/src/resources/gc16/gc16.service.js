const debug = require('debug')('service:gc16s')
const _ = require('lodash')
const { GC16 } = require('./gc16.model')

exports.get_gc16_list = async () => {
    try {
        const gc16_list = await GC16.find({}).populate('control_point')

        return gc16_list

    } catch (error) {
        throw new Error(error)
    }
}

exports.get_gc16 = async (id) => {
    try {
        const gc16 = await GC16
            .findById(id)
            .populate('control_point')

        return gc16
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_control_point = async (control_point_id) => {
    try {
        const gc16 = await GC16.findOne({ control_point: control_point_id })
        if (gc16) return true

        return false
    } catch (error) {
        throw new Error(error)
    }
}

exports.create_gc16 = async (gc16) => {
    try {
        const new_gc16 = new GC16(gc16)
        await new_gc16.save()


        return new_gc16
    } catch (error) {
        debug(error)
        throw new Error(error)
    }
}

exports.find_by_id = async (id) => {
    try {
        const gc16 = await GC16.findById(id)
            .populate('control_point')

        return gc16
    } catch (error) {
        throw new Error(error)
    }
}

exports.update_gc16 = async (id, gc16_edited) => {
    try {
        const options = { runValidators: true, new: true }
        const gc16 = await GC16.findByIdAndUpdate(id, gc16_edited, options)

        return gc16
    } catch (error) {
        throw new Error(error)
    }
}