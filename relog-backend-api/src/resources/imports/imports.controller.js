const debug = require('debug')('controller:home')
const HttpStatus = require('http-status-codes')
const xlsx = require('node-xlsx').default
const fs = require('fs')
const { Packing } = require('../packings/packings.model')
const { ControlPoint } = require('../control_points/control_points.model')
const { Family } = require('../families/families.model')
const { Project } = require('../projects/projects.model')
const { Type } = require('../types/types.model')
const { Company } = require('../companies/companies.model')

exports.import_packing = async (req, res) => {
    if (Object.keys(req.files).length == 0) return res.status(HttpStatus.BAD_REQUEST).send({ message: 'No files were uploaded.' })
    
    const packing_xlsx = req.files.packing_xlsx
    const file_name = new Date().getTime().toString() + 'packing'
    const file_path = `${__dirname}/uploads/${file_name}.xlsx`

    packing_xlsx.mv(file_path, async err => {
        try {
            if (err) return res.status(HttpStatus.BAD_REQUEST).send({ message: err })
            let errors = []
            let updated = []
            let to_register = []

            const workSheetsFromFile = xlsx.parse(file_path)
            const packings = workSheetsFromFile[0].data.filter((data, index) => index !== 0)

            for (const [index, packing] of packings.entries()) {
                let temp_obj = {}

                const tag = { code: packing[2] }
                const current_packing = await Packing.findByTag(tag)
                const family = await Family.findByCode(packing[0])
                const project = packing[12] != undefined ? await Project.findOne({ name: packing[12].toString() }) : null

                if (!project && packing[12] != undefined) errors.push({ line: index + 1, description: `Project with this name ${packing[12]} do not exists` })

                if (!family) {
                    errors.push({ line: index + 1, description: `Family code ${packing[0]} do not exists` })
                } else {
                    if (!current_packing) {
                        temp_obj.line = index + 1
                        temp_obj.data = {
                            family: family,
                            serial: packing[1],
                            tag: {
                                code: packing[2],
                                version: packing[3],
                                manufactorer: packing[4],
                            },
                            weigth: packing[5],
                            width: packing[6],
                            height: packing[7],
                            length: packing[8],
                            capacity: packing[9],
                            observations: packing[10],
                            type: packing[11],
                        }
                        
                        if(project) temp_obj.data.project 

                        to_register.push(temp_obj)

                    } else {
                        await Packing.findByIdAndUpdate(current_packing._id, {
                            family: family,
                            serial: packing[1],
                            tag: {
                                code: packing[2],
                                version: packing[3],
                                manufactorer: packing[4],
                            },
                            weigth: packing[5],
                            width: packing[6],
                            height: packing[7],
                            length: packing[8],
                            capacity: packing[9],
                            observations: packing[10],
                            type: packing[11],
                            project: project ? project._id : undefined
                        })
                        
                        temp_obj.line = index + 1
                        temp_obj.data = await Packing.findById(current_packing._id).populate('family')

                        updated.push(temp_obj)
                    }
                }
                
            }

            const data = { errors, updated, to_register }

            fs.unlink(file_path, err => {
                if (err) return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Falha ao remover o arquivo.' })
            })

            res.json(data)
        } catch (error) {
			console.log("​Fora do forEach -> error", error)
            throw new Error(error)
        }
    })
    
}

exports.import_control_points = async (req, res) => {
    if (Object.keys(req.files).length == 0) return res.status(HttpStatus.BAD_REQUEST).send({ message: 'No files were uploaded.' })
    
    const control_point_xlsx = req.files.control_point_xlsx
    const file_name = new Date().getTime().toString() + 'control_point'
    const file_path = `${__dirname}/uploads/${file_name}.xlsx`

    control_point_xlsx.mv(file_path, async err => {
        try {
            if (err) return res.status(HttpStatus.BAD_REQUEST).send({ message: err })
            let errors = []
            let updated = []
            let to_register = []

            const workSheetsFromFile = xlsx.parse(file_path)
            const control_points = workSheetsFromFile[0].data.filter((data, index) => index !== 0)

            for (const [index, control_point] of control_points.entries()) {
                let temp_obj = {}

                let coordinates = []
                const current_control_point = await ControlPoint.findOne({ name: control_point[3] })
                const company = await Company.findByName(control_point[6])
                const type = await Type.findByName(control_point[5])

                if (!company) {
                    errors.push({ line: index + 1, description: `Company with this name ${control_point[6]} do not exists` })
                } else {
                    if (!type) {
                        errors.push({ line: index + 1, description: `Type with this name ${control_point[5]} do not exists` })
                    } else {
                        if (!current_control_point) {
                            temp_obj.line = index + 1
                            if (control_point[0] === 'p') {

                                let temp_coordinates = control_point[1].split('').filter(ele => ele != '[' && ele != ']').join('').split(',')
                                
                                coordinates = temp_coordinates.map((e, index) => {
                                    let obj = {}

                                    if (index % 2 == 0) {
                                        obj.lat = e
                                        obj.lng = temp_coordinates[index + 1]
                                        return obj
                                    }
                                }).filter(element => element != undefined)

                                temp_obj.data = {
                                    name: control_point[3],
                                    company: company,
                                    type: type,
                                    duns: control_point[7],
                                    full_address: control_point[4],
                                    geofence: {
                                        coordinates: coordinates,
                                        radius: control_point[2],
                                        type: control_point[0]
                                    }
                                }
                            } else {
                                coordinates = control_point[1].split('').filter(ele => ele != '[' && ele != ']').join('').split(',')
                                temp_obj.data = {
                                    name: control_point[3],
                                    company: company,
                                    type: type,
                                    duns: control_point[7],
                                    full_address: control_point[4],
                                    geofence: {
                                        coordinates: [{ lat: parseFloat(coordinates[0]), lng: parseFloat(coordinates[1]) }],
                                        radius: control_point[2],
                                        type: control_point[0]
                                    }
                                }
                            }

                            to_register.push(temp_obj)

                        } else {
                            // await Packing.findByIdAndUpdate(current_packing._id, {
                                
                            // })
                            coordinates = control_point[1].split('').filter(ele => ele != '[' && ele != ']').join('').split(',')
                            temp_obj.line = index + 1
                            temp_obj.data = {
                                name: control_point[3],
                                company: company,
                                type: type,
                                duns: control_point[7],
                                full_address: control_point[4],
                                geofence: {
                                    coordinates: [{ lat: parseFloat(coordinates[0]), lng: parseFloat(coordinates[1]) }],
                                    radius: control_point[2],
                                    type: control_point[0]
                                }
                            }
                            // temp_obj.data = await Packing.findById(current_packing._id)
                            updated.push(temp_obj)
                        }
                    }
                }
                
            }

            const data = { errors, updated, to_register }

            fs.unlink(file_path, err => {
                if (err) return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Falha ao remover o arquivo.' })
            })

            res.json(data)
        } catch (error) {
			console.log("​Fora do forEach -> error", error)
            throw new Error(error)
        }
    })    
}