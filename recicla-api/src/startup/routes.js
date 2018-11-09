const express = require('express')
const body_parser = require('body-parser')
const cors = require('cors')
const users = require('../resources/users/users.routing')
const companies = require('../resources/companies/companies.routing')
const families = require('../resources/families/families.routing')
const packings = require('../resources/packings/packings.routing')
const control_points = require('../resources/control_points/control_points.routing')
const types = require('../resources/types/types.routing')
const routes = require('../resources/routes/routes.routing')
const departments = require('../resources/departments/departments.routing')
const device_data = require('../resources/device_data/device_data.routing')
const projects = require('../resources/projects/projects.routing')
const reports = require('../resources/reports/reports.routing')
const settings = require('../resources/settings/settings.routing')
const error = require('../middlewares/error_handler.middleware')

module.exports = (app) => {
    const corsOptions = {
        origin: "*",
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        preflightContinue: false,
        optionsSuccessStatus: 204
    }

    // Cors Middlewares
    app.use(body_parser.json({ limit: '50mb' }))
    app.use(body_parser.urlencoded({ limit: '50mb', extended: true }))
    app.use(body_parser.json({ type: 'application/vnd.api+json' }))
    app.use(express.json())
    app.use(cors(corsOptions))

    // Routes
    app.get('/', (req, res) => res.redirect('/api-docs'))
    app.use('/api/users', users)
    app.use('/api/companies', companies)
    app.use('/api/families', families)
    app.use('/api/packings', packings)
    app.use('/api/control_points', control_points)
    app.use('/api/types', types)
    app.use('/api/routes', routes)
    app.use('/api/departments', departments)
    app.use('/api/projects', projects)
    app.use('/api/reports', reports)
    app.use('/api/device_data', device_data)
    app.use('/api/settings', settings)

    // Middlewares functions
    app.use(error)
}