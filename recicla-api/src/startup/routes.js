const express = require('express')
const body_parser = require('body-parser')
const cors = require('cors')
const users = require('../resources/users/users.routing')
const companies = require('../resources/companies/companies.routing')
const families = require('../resources/families/families.routing')
const packings = require('../resources/packings/packings.routing')
const error = require('../middlewares/error.middleware')

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

    // Middlewares functions
    app.use(error)
}