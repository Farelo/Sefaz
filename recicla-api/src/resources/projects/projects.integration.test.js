const request = require('supertest')
const mongoose = require('mongoose')
const { User } = require('../users/users.model')
const { Company } = require('../companies/companies.model')
const { Project } = require('./projects.model')

describe('api/projects', () => {
    let server
    let token
    let new_company
    let new_user
    let project_body
    beforeEach(async () => {
        server = require('../../server')

        new_company = await Company.create({ name: 'CEBRACE TESTE' })

        new_user = await User.create({
            full_name: 'Teste Man',
            email: "serginho@gmail.com",
            password: "qwerty123",
            role: 'admin',
            company: {
                _id: new_company._id,
                name: new_company.name
            }
        })
        
        token = new_user.generateUserToken()
        project_body = {name: 'TESTE'}
    })
    afterEach(async () => {
        await server.close()
        await User.deleteMany({})
        await Company.deleteMany({})
        await Project.deleteMany({})
    })

    describe('AUTH MIDDLEWARE', () => {
        const exec = () => {
            return request(server)
                .post('/api/projects')
                .set('Authorization', token)
                .send(project_body)
        }
        it('should return 401 if no token is provided', async () => {
            token = ''
            const res = await exec()
            expect(res.status).toBe(401)
        })

        it('should return 400 if token is invalid', async () => {
            token = 'a'
            const res = await exec()
            expect(res.status).toBe(400)
        })

        it('should return 201 if token is valid', async () => {
            const res = await exec()
            expect(res.status).toBe(201)
        })
    })

    describe('AUTHZ MIDDLEWARE', () => {
        const exec = () => {
            return request(server)
                .post('/api/projects')
                .set('Authorization', token)
                .send(project_body)
        }
        it('should return 403 if user is not admin', async () => {
            const new_user = await User.create({
                full_name: 'Teste Man',
                email: "serginho1@gmail.com",
                password: "qwerty123",
                role: 'user',
                company: {
                    _id: new_company._id,
                    name: new_company.name
                }
            })

            token = new_user.generateUserToken()

            const res = await exec()
            expect(res.status).toBe(403)
        })

        it('should return 201 if user is admin', async () => {
            const res = await exec()
            expect(res.status).toBe(201)
        })
    })

    describe('GET: /api/projects', () => {
        it('should return all projects', async () => {
            await Project.collection.insertMany([
                { name: 'teste 1' },
                { name: 'teste 2' },
                { name: 'teste 3' }
            ])

            const res = await request(server)
                .get('/api/projects')
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
            expect(res.body.some(p => p.name === 'teste 1')).toBeTruthy()
            expect(res.body.some(p => p.name === 'teste 2')).toBeTruthy()
            expect(res.body.some(p => p.name === 'teste 3')).toBeTruthy()
        })
    })

    describe('GET /api/projects/:id', () => {
        it('should return a project if valid id is passed', async () => {
            const project = await Project.create(project_body)

            const res = await request(server)
                .get(`/api/projects/${project._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('name', project.name)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/projects/1a`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('POST: /api/projects', () => {
        const exec = () => {
            return request(server)
                .post('/api/projects')
                .set('Authorization', token)
                .send({ name: project_body.name, control_point: project_body.control_point })
        }

        it('should return 400 if name is not provied', async () => {
            project_body.name = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if project name already exists', async () => {
            await Project.create(project_body)

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 201 if project is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(201)
        })

        it('should return project if is valid request', async () => {
            const res = await exec()

            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'name'])
            )
        })
    })

    describe('PATCH: /api/projects/:id', () => {
        let resp
        const exec = () => {
            return request(server)
                .patch(`/api/projects/${resp.body._id}`)
                .set('Authorization', token)
                .send({ name: 'teste edited'})
        }
        beforeEach(async () => {
            resp = await request(server)
                .post('/api/projects')
                .set('Authorization', token)
                .send(project_body)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/projects/1`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return project edited if is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.name).toBe('teste edited')
            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'name'])
            )
        })
    })

    describe('DELETE: /api/projects/:id', () => {
        let resp
        const exec = () => {
            return request(server)
                .delete(`/api/projects/${resp.body._id}`)
                .set('Authorization', token)
        }

        it('should return 200 if deleted with success', async () => {
            resp = await request(server)
                .post('/api/projects')
                .set('Authorization', token)
                .send(project_body)

            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Delete successfully')
        })
    })
})