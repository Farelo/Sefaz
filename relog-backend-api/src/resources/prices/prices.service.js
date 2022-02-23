const e = require("cors");
const _ = require('lodash')
const { Price } = require("./prices.model")

exports.get_all_prices = async () => {
    try {
        const data = await Price.find({ excluded_at: { $exists: false }})
       
        return data ? data : []
    } catch (error) {
        throw new Error(error)
    }
}

exports.create_price = async (price) => {
    try {
        var price = new Price(price)
        await price.save()
        return price
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_id = async (id) => {
    try {
        var price = await Price.findById(id).where({ excluded_at: { $exists: false }})
        return price
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_item_id = async (item_id) => {
    try {
        const prices = await Price.find({ 'item_id': item_id }).where({ excluded_at: { $exists: false }})
        return prices
    } catch (error) {
        throw new Error(error)
    }
}

