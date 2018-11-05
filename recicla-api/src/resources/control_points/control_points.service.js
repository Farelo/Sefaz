const debug = require('debug')('service:control_points')
const _ = require('lodash')
const { ControlPoint } = require('./control_points.model')

exports.get_control_points = async (name) => {
    try {
        if (!name) return await ControlPoint.find().populate('company').populate('type', ['_id', 'name'])
        
        const data = await ControlPoint.findByName(name).populate('type', ['_id', 'name'])
        return data ? [data] : []
    } catch (error) {
        throw new Error(error)
    }
}

exports.get_control_point = async (id) => {
    try {
        const control_point = await ControlPoint
            .findById(id)
            .populate('company')
            .populate('type', ['_id', 'name'])

        return control_point
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_name = async (name) => {
    try {
        const control_point = await ControlPoint.findByName(name)
        return control_point
    } catch (error) {
        throw new Error(error)
    }
}

exports.create_control_point = async (control_point) => {
    try {
        const new_control_point = new ControlPoint(control_point)
        await new_control_point.save()

        return new_control_point
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_id = async (id) => {
    try {
        const control_point = await ControlPoint.findById(id)
        return control_point
    } catch (error) {
        throw new Error(error)
    }
}

exports.update_control_point = async (id, control_point_edited) => {
    try {
        const options = { runValidators: true, new: true }
        const control_point = await ControlPoint.findByIdAndUpdate(id, control_point_edited, options)

        return control_point
    } catch (error) {
        throw new Error(error)
    }
}