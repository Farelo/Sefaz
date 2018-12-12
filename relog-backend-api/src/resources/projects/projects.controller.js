const debug = require('debug')('controller:projects')
const HttpStatus = require('http-status-codes')
const projects_service = require('./projects.service')

exports.all = async (req, res) => {
    const name = req.query.name ? req.query.name : null
    const projects = await projects_service.get_projects(name)

    res.json(projects)
}

exports.show = async (req, res) => {
    const project = await projects_service.get_project(req.params.id)
    if (!project) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid project.' })

    res.json(project)
}

exports.create = async (req, res) => {
    let project = await projects_service.find_by_name(req.body.name)
    if (project) return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Project already exists with this name.' })

    project = await projects_service.create_project(req.body)

    res.status(HttpStatus.CREATED).send(project)
}

exports.update = async (req, res) => {
    let project = await projects_service.find_by_id(req.params.id)
    if (!project) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid project'})

    project = await projects_service.update_project(req.params.id, req.body)

    res.json(project)
}

exports.delete = async (req, res) => {
    const project = await projects_service.find_by_id(req.params.id)
    if (!project) res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid project' })

    await project.remove()

    res.send({ message: 'Delete successfully' })
}