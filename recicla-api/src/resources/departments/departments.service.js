const debug = require('debug')('service:departments')
const _ = require('lodash')
const { Department } = require('./departments.model')

exports.get_departments = async (name) => {
    try {
        if (!name) return await Department.find().populate('control_point')

        const data = await Department.findByName(name)
        return data ? [data] : []
    } catch (error) {
        throw new Error(error)
    }
}

exports.get_department = async (id) => {
    try {
        const department = await Department
            .findById(id)
            .populate('control_point')

        return department
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_name = async (name) => {
    try {
        const department = await Department.findByName(name)
        return department
    } catch (error) {
        throw new Error(error)
    }
}

exports.create_department = async (department) => {
    try {
        const new_department = new Department(department)
        await new_department.save()

        return new_department
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_id = async (id) => {
    try {
        const department = await Department.findById(id)
        return department
    } catch (error) {
        throw new Error(error)
    }
}

exports.update_department = async (id, department_edited) => {
    try {
        const options = { runValidators: true, new: true }
        const department = await Department.findByIdAndUpdate(id, department_edited, options)

        return department
    } catch (error) {
        throw new Error(error)
    }
}