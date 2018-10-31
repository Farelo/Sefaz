const debug = require('debug')('service:packings')
const _ = require('lodash')
const { Packing } = require('./packings.model')

exports.get_packings = async (tag) => {
    try {
        if (!tag) return await Packing.find().populate('packing', ['_id', 'code']).populate('family', ['_id', 'code', 'company'])

        const data = await Packing.findByTag(tag).populate('family', ['_id', 'code', 'company'])
        return data ? [data] : []
    } catch (error) {
        throw new Error(error)
    }
}

exports.get_packing = async (id) => {
    try {
        const packing = await Packing
            .findById(id)
            .populate('family', ['_id', 'code', 'company'])
        
        return packing
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_tag = async (tag) => {
    try {
        const packing = await Packing.findByTag(tag).populate('family', ['_id', 'code', 'company'])
        return packing
    } catch (error) {
        throw new Error(error)
    }
}

exports.create_packing = async (packing) => {
    try {
        const new_packing = new Packing(packing)
        await new_packing.save()

        return new_packing
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_id = async (id) => {
    try {
        const packing = await Packing.findById(id)
            .populate('family', ['_id', 'code', 'company'])

        return packing
    } catch (error) {
        throw new Error(error)
    }
}

exports.update_packing = async (id, packing_edited) => {
    try {
        const options = { runValidators: true, new: true }
        const packing = await Packing.findByIdAndUpdate(id, packing_edited, options)

        return packing
    } catch (error) {
        throw new Error(error)
    }
}