const debug = require('debug')('service:familys')
const _ = require('lodash')
const { Family } = require('./families.model')

exports.get_families = async (code) => {
    try {
        let families
        if (code) {
            families = await Family.findByCode(code)
            if (!families) families = []
        } else {
            families = await Family.find().populate('company', ['_id', 'name', 'type'])
        }

        return families
    } catch (error) {
        throw new Error(error)
    }
}

exports.get_family = async (id) => {
    try {
        const family = await Family
            .findById(id)
            .populate('company', ['_id', 'name', 'type'])
            .populate('familys', ['_id', 'tag', 'serial', 'active', 'low_battery', 'absent'])

        return family
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_code = async (code) => {
    try {
        const family = await Family.findByCode(code)
        return family
    } catch (error) {
        throw new Error(error)
    }
}

exports.create_family = async (family) => {
    try {
        const new_family = new Family(family)
        await new_family.save()

        return new_family
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_id = async (id) => {
    try {
        const family = await Family.findById(id)
        return family
    } catch (error) {
        throw new Error(error)
    }
}

exports.update_family = async (id, family_edited) => {
    try {
        const options = { runValidators: true, new: true }
        const family = await Family.findByIdAndUpdate(id, family_edited, options)

        return family
    } catch (error) {
        throw new Error(error)
    }
}