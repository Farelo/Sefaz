const debug = require('debug')('service:projects')
const _ = require('lodash')
const { Project } = require('./projects.model')

exports.get_projects = async (name) => {
    try {
        if (!name) return await Project.find()

        const data = await Project.findByName(name)
        return data ? [data] : []
    } catch (error) {
        throw new Error(error)
    }
}

exports.get_project = async (id) => {
    try {
        const project = await Project.findById(id)

        return project
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_name = async (name) => {
    try {
        const project = await Project.findByName(name)
        return project
    } catch (error) {
        throw new Error(error)
    }
}

exports.create_project = async (project) => {
    try {
        const new_project = new Project(project)
        await new_project.save()

        return new_project
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_id = async (id) => {
    try {
        const project = await Project.findById(id)
        return project
    } catch (error) {
        throw new Error(error)
    }
}

exports.update_project = async (id, project_edited) => {
    try {
        const options = { runValidators: true, new: true }
        const project = await Project.findByIdAndUpdate(id, project_edited, options)

        return project
    } catch (error) {
        throw new Error(error)
    }
}