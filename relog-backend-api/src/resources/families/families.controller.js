const debug = require('debug')('controller:families')
const HttpStatus = require('http-status-codes')
const families_service = require('./families.service')
const rack_items_service = require('../racks_items/racks_items.service')
const logs_controller = require('../logs/logs.controller')

exports.all = async (req, res) => {
    const code = req.query.code ? req.query.code : null
    const families = await families_service.get_families(code)

    res.json(families)
}

exports.show = async (req, res) => {
    const family = await families_service.get_family(req.params.id)
    if (!family) return res.status(HttpStatus.NOT_FOUND).send('Invalid family')

    res.json(family)
}

exports.create = async (req, res) => {
    let family = await families_service.find_by_code(req.body.code)
    if (family) return res.status(HttpStatus.BAD_REQUEST).send('Family already exists with this code.')

    const rack_items_array = req.body.rack_items
    for(var i in rack_items_array){
        const existing_item = await rack_items_service.find_by_id(rack_items_array[i])
        if(!existing_item) return res.status(HttpStatus.BAD_REQUEST).send('Rack item' + rack_items_array[i] +  'not found')
    }
  
    family = await families_service.create_family(req.body)
    logs_controller.create({token:req.headers.authorization, log:'create_family' , newData:req.body});

    res.status(HttpStatus.CREATED).send(family)
}

exports.update = async (req, res) => {
    let family = await families_service.find_by_id(req.params.id)
    if (!family) return res.status(HttpStatus.NOT_FOUND).send('Invalid family')

    family = await families_service.update_family(req.params.id, req.body)
    logs_controller.create({token:req.headers.authorization, log:'update_family' , newData:req.body});

    res.json(family)
}

exports.delete = async (req, res) => {
    const family = await families_service.find_by_id(req.params.id)
    if (!family) res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid family' })

    
    logs_controller.create({token:req.headers.authorization, log:'delete_family' , newData:family});
    await family.remove()

    res.send({ message: 'Delete successfully' })
}

exports.insert_item = async (req, res) => {
    let family = await families_service.find_by_id(req.params.id)
    if (!family) return res.status(HttpStatus.NOT_FOUND).send('Invalid family')

    const existing_item = await rack_items_service.find_by_id(req.body.item_id)
    if(!existing_item) return res.status(HttpStatus.BAD_REQUEST).send('Rack item' + req.body.item_id +  'not found')

    family = await families_service.add_item(req.params.id, req.body.item_id)
    logs_controller.create({token:req.headers.authorization, log:'update_family' , newData:req.body});

    res.json(family)
}

exports.remove_item = async (req, res) => {
    let family = await families_service.find_by_id(req.params.id)
    if (!family) return res.status(HttpStatus.NOT_FOUND).send('Invalid family')

    const existing_item = await rack_items_service.find_by_id(req.body.item_id)
    if(!existing_item) return res.status(HttpStatus.BAD_REQUEST).send('Rack item' + req.body.item_id +  'not found')

    family = await families_service.remove_item(req.params.id, req.body.item_id)
    logs_controller.create({token:req.headers.authorization, log:'update_family' , newData:req.body});

    res.json(family)
} 