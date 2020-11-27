const debug = require('debug')('controller:logs')
const mongoose = require("mongoose");
const HttpStatus = require('http-status-codes')
const logs_service = require('./logs.service')
const jwt = require('jsonwebtoken')
const config = require('config');

exports.find = async (req, res) => {
    const logs = await projects_service.get_projects(name)

    res.json(projects)
}

exports.create = async (req, res) => {

    let userId = req.id;
    let log = req.log;
    let token = req.token;
    let newData = req.newData;   

    token = token.split(' '); 

    const decoded_payload = jwt.verify(token[1], config.get('security.jwtPrivateKey'))

    await logs_service.create_log({userId:decoded_payload._id,log,newData})
}


exports.findBy = async (req, res) => {
    let project = await projects_service.find_by_name(req.body.name)
    if (project) return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Project already exists with this name.' })

    project = await projects_service.create_project(req.body)

    res.status(HttpStatus.CREATED).send(project)
}
