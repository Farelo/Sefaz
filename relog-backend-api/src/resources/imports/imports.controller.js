const debug = require('debug')('controller:home')
const HttpStatus = require('http-status-codes')
const xlsx = require('node-xlsx').default
const fs = require('fs')
const { Packing } = require('../packings/packings.model')
const { Family } = require('../families/families.model')
const { Project } = require('../projects/projects.model')

exports.import_packing = async (req, res) => {
    if (Object.keys(req.files).length == 0) return res.status(HttpStatus.BAD_REQUEST).send({ message: 'No files were uploaded.' })
    
    let packings = []
    const packing_xlsx = req.files.packing_xlsx
    const file_name = new Date().getTime().toString()
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
                            family: family._id,
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
                            family: family._id,
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
                        temp_obj.data = await Packing.findById(current_packing._id)

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