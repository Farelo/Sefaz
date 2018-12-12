const request = require('supertest')
const mongoose = require('mongoose')
const { User } = require('../users/users.model')
const { Company } = require('../companies/companies.model')
const { Project } = require('./projects.model')
const _ = require('lodash')

describe('api/projects', () => {
    let server
    let token
    let new_company
    let new_user
    let project_body
    let new_project
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

        new_project = new Project(project_body)
        new_project.save()
    })
    afterEach(async () => {
        await server.close()
        await User.deleteMany({})
        await Company.deleteMany({})
        await Project.deleteMany({})
    })

    describe('GET: /api/projects', () => {
        it('should return all projects', async () => {
            await Project.collection.insertMany([
                { name: 'teste 1' },
                { name: 'teste 2' },
                { name: 'teste 3' }
            ])
            let saveProjects = await Project.find({})
            .select(["-created_at", "-update_at", "-__v"])
            saveProjects = JSON.parse(JSON.stringify(saveProjects))

            const res = await request(server)
                .get('/api/projects')
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(4)
            const body = res.body.map((e) => _.omit(e, ["__v", "created_at", "update_at"]))
            expect(body).toEqual(saveProjects)
        })

        it('should return 404 if invalid url is passed', async () => { 
            const res = await request(server)
                .get(`/api/projectsss`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('GET /api/projects/:id', () => {
        let project
        beforeEach(async () => {
            project = new Project({ name: 'teste 1' })
            project.save()
        })
        it('should return a type if valid id is passed', async () => {
            const res = await request(server)
                .get(`/api/projects/${project._id}`)
                .set('Authorization', token)

            const body_res = _.omit(res.body, ["__v", "created_at", "update_at"])
            let body_toEqual = {
                _id: project._id,
                name: 'teste 1'
            }
            body_toEqual = JSON.parse(JSON.stringify(body_toEqual))
            expect(res.status).toBe(200)
            expect(body_res).toEqual(body_toEqual)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/projects/1a`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid url with valid id is passed', async () => { 
            const res = await request(server)
                .get(`/api/projectsss/${project._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('POST: /api/projects', () => {
        const exec = () => {
            return request(server)
                .post('/api/projects')
                .set('Authorization', token)
                .send(project_body)
        }

        it('should return 400 if name is not provied', async () => {
            project_body.name = ''

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" is not allowed to be empty",
                "\"name\" length must be at least 5 characters long"
              ])
        })

        it('should return 400 if project name already exists', async () => {
            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body.message).toBe("Project already exists with this name.")
        })

        it('should return 201 if type is valid request', async () => {
            project_body.name = 'project create test'
            const res = await exec()
            const body_res = _.omit(res.body, ["_id", "__v", "created_at", "update_at"])

            expect(res.status).toBe(201)
            expect(body_res).toEqual(JSON.parse(JSON.stringify({name: project_body.name})))
        })

        it('should return 400 if is body is empty', async () => {
            const exec = () => {
                return request(server)
                    .post('/api/projects')
                    .set('Authorization', token)
                    .send({})
            }

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" is required"
            ])
        })

        it('should return 400 if is unknow key is provied', async () => {
            project_body.test = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 404 if invalid url is provied', async () => {
            const exec = () => {
                return request(server)
                    .post('/api/projectsss')
                    .set('Authorization', token)
                    .send(project_body)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 400 if name has large amount of characters', async () => {
            project_body.name = 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasd'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" length must be less than or equal to 50 characters long"
            ])
        })

        it('should return 400 if name has small amount of characters', async () => {
            project_body.name = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" length must be at least 5 characters long"
            ])
        })

        it('should return 400 if the attribute types diferent than expected', async () => {
            project_body.name = 11

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" must be a string"
              ])
        })
    })

    describe('PATCH: /api/projects/:id', () => {
        
        const exec = () => {
            return request(server)
                .patch(`/api/projects/${new_project._id}`)
                .set('Authorization', token)
                .send(project_body)
        }
        
        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .patch(`/api/project/1`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return 400 if name is not provied', async () => {
            project_body.name = ''

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" is not allowed to be empty",
                "\"name\" length must be at least 5 characters long"
            ])
        })

        it('should return 200 if project is valid request', async () => {
            project_body.name = 'update project'
            
            const res = await exec()
            const body_res = _.omit(res.body, ["_id", "__v", "created_at", "update_at"])

            expect(res.status).toBe(200)
            expect(body_res).toEqual(JSON.parse(JSON.stringify({name: project_body.name})))
        })

        it('should return 400 if is body is empty', async () => {
            project_body = {}

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" is required"
            ])
        })

        it('should return 400 if is unknow key is provied', async () => {
            project_body.test = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 404 if invalid url is provied', async () => {
            const exec = () => {
                return request(server)
                    .patch('/api/projectss')
                    .set('Authorization', token)
                    .send(project_body)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 400 if name has large amount of characters', async () => {
            project_body.name = 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasd'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" length must be less than or equal to 50 characters long"
            ])
        })

        it('should return 400 if name has small amount of characters', async () => {
            project_body.name = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" length must be at least 5 characters long"
            ])
        })

        it('should return 400 if the attribute types diferent than expected', async () => {
            project_body.name = 11

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" must be a string"
              ])
        })
        
    })

    describe('DELETE: /api/project/:id', () => {
        let resp
        let exec
        
        beforeEach(async () => {
        
            exec = () => {
                return request(server)
                    .delete(`/api/projects/${new_project._id}`)
                    .set('Authorization', token)
            }    
        })

        it('should return 200 if deleted with success', async () => {
            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Delete successfully')
        })

        it('should return 400 if deleted project nonexistent', async () => {
            await exec()
            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('Invalid project')
        })

        it('should return 404 if url invalid is provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/project/${new_project._id}`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid id is provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/project/aa`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if id is not provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/project/`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })
    })
})