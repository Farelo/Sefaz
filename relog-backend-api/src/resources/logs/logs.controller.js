const debug = require('debug')('controller:logs')
const mongoose = require("mongoose");
const HttpStatus = require('http-status-codes')
const logs_service = require('./logs.service')

exports.find = async (req, res) => {
    const logs = await projects_service.get_projects(name)

    res.json(projects)
}

exports.create = async (req, res) => {
    
    let userId = req.id;
    let log = req.log;
    
    await logs_service.create_log(userId,log)
}


exports.findBy = async (req, res) => {
    let project = await projects_service.find_by_name(req.body.name)
    if (project) return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Project already exists with this name.' })

    project = await projects_service.create_project(req.body)

    res.status(HttpStatus.CREATED).send(project)
}
