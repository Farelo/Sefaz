const debug = require("debug")("service:rack_items");
const e = require("cors");
const _ = require('lodash')
const { RackItem } = require("./racks_items.model")

exports.get_all_rack_items = async (options) => {
    try {
        const data = await RackItem.find({ excluded_at: { $exists: false }})
       
        return data ? data : []
    } catch (error) {
        throw new Error(error)
    }
}

exports.create_rack_item = async (rack_item) => {
    try {
        const data = {
            name: rack_item.name,
            description: rack_item.description
        }
        var new_rack_item = new RackItem(data)
      
        new_rack_item.price.push(rack_item.price)
        await new_rack_item.save()

        return new_rack_item
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_id = async (id) => {
    try {
        var rack_item = await RackItem.findById(id).where({ excluded_at: { $exists: false }})
        rack_item.price = rack_item.price[rack_item.price.length - 1]
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

exports.update_rack = async (id, new_price) => {
    try {   
        var new_date = new Date(new_price.date);

        var new_rack_item = await RackItem.findByIdAndUpdate(id)
        new_rack_item.price.push({cost: new_price.cost, date: new_date})
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
        console.log("start date", startDate)
        console.log("end date", endDate)
        console.log("start date", Date.now())
        console.log("----")
        const startDat = startDate ? new Date(startDate) : "null";
        let today = new Date();
        var endDat = endDate ? new Date() : today;
        endDat.setDate(endDate.getDate())
        endDat.setHours(22, 59, 59);
        console.log("start date", startDat)
        console.log("end date", endDat)

        const rack_item = await RackItem.findById(id).select('name price')
        const prices = rack_item.price;

        const history = prices.filter(elem => {
            return(elem.date.getTime() >= startDat.getTime() && elem.date.getTime() <= endDat.getTime()) 
        })
        
        return history
    } catch (error) {
        throw new Error(error)
    }
}

exports.update_rack_item_price = async (id, new_price_id) => {
    try {    
        var new_rack_item = await RackItem.findById(id)
        new_rack_item.prices.push(new_price_id)
        await new_rack_item.save()
        return new_rack_item
    } catch (error) {
        throw new Error(error)
    }
}