const debug = require("debug")("service:rack_items");
const e = require("cors");
const _ = require('lodash')
const { RackItem } = require("./racks_items.model")
const { Price } = require("../prices/prices.model")

exports.get_all_rack_items = async (options) => {
    try {
        const startDate = options.startDate ? new Date(options.startDate) : "null";
        let today = new Date();
        var endDate = options.endDate ? new Date(options.endDate) : today;
        endDate.setHours(22, 59, 59);
    
        var data = await RackItem.find({ excluded_at: { $exists: false }})
        .populate('prices', ['cost', 'date'])
        .select('_id name prices')

        const new_data = data.filter(elem => {
            elem.prices = elem.prices.filter(price => {
                const is_between_interval = (price.date.getTime() >= startDate.getTime()) && price.date.getTime() <= endDate.getTime()
                return is_between_interval == true
            })
            return elem.prices.length > 0
        })

        return new_data ? new_data : []
    } catch (error) {
        throw new Error(error)
    }
}

exports.create_rack_item = async (rack_item) => {
    try {
        /* const data = {
            name: rack_item.name,
            description: rack_item.description,
            current_price: rack_item.current_price
        } */
        var new_rack_item = new RackItem(rack_item)
        await new_rack_item.save()

        return new_rack_item
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_id = async (id) => {
    try {
        var rack_item = await RackItem.findById(id).where({ excluded_at: { $exists: false }})
    
        return rack_item
    } catch (error) {
        throw new Error(error)
    }
}

exports.update_rack_item = async (id, rack_edited) => {
    try {
        const options = { new: true }
        const new_rack_item = await RackItem.findByIdAndUpdate(id, rack_edited, options)
        return new_rack_item
    } catch (error) {
        throw new Error(error)
    }
}

exports.update_current_price = async (id, new_price_id) => {
    try {   
        const options = { new: true }
        var new_rack_item = await RackItem.findByIdAndUpdate(id, {current_price: new_price_id}, options)
        new_rack_item.prices.push(new_price_id)
        await new_rack_item.save()
        return new_rack_item
    } catch (error) {
        throw new Error(error)
    }
}

exports.delete_rack_item = async (id, rack_edited) => {
    try {
        const options = { new: true }
        const new_rack_item = await RackItem.findByIdAndUpdate(id, rack_edited, options)
        return new_rack_item
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_name = async (name) => {
    try {
        const rack_item = await RackItem.findOne({ 'name': name }).where({ excluded_at: { $exists: false }})
        return rack_item
    } catch (error) {
        throw new Error(error)
    }
}

exports.get_price_history = async (id, startDate, endDate) => {
    try {
        const startDat = new Date(startDate)
        let today = new Date();
        var endDat = endDate ? new Date(endDate) : today;
        endDat.setHours(22, 59, 59);

        const rack_item = await RackItem.findById(id)
        .select('name price')
        .populate('prices', 'date cost')
        console.log("rack item", rack_item)
        const prices = rack_item.prices;

        //get each price in prices model
        const history = prices.filter(elem => {
            return(elem.date.getTime() >= startDat.getTime() && elem.date.getTime() <= endDat.getTime()) 
        })
        
        return history
    } catch (error) {
        throw new Error(error)
    }
}

exports.update_rack_item_price = async (id, price_id) => {
    try {    
        const options = { new: true }
        var new_rack_item = await RackItem.findByIdAndUpdate(id, {current_price: price_id}, options)
        new_rack_item.prices.push(price_id)
        await new_rack_item.save()
        return new_rack_item
    } catch (error) {
        throw new Error(error)
    }
}