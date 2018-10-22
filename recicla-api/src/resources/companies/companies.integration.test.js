const request = require('supertest')
const mongoose = require('mongoose')
const { Company } = require('./companies.model')
const { User } = require('../users/users.model')

describe('api/companies', () => {
    let server
    let company_id
    let newCompany
    let newUser
    let token
    beforeEach(async () => {
        server = require('../../server')

        company_id = mongoose.Types.ObjectId()
        newCompany = new Company({ _id: company_id, name: 'CEBRACE TESTE' })
        // await newCompany.save()
        
        const user = {
            full_name: 'Teste Man',
            email: "serginho@gmail.com",
            password: "qwerty123",
            role: 'admin',
            company: {
                _id: newCompany._id,
                name: newCompany.name
            }
        }
        
        newUser = new User(user)
        // await newUser.save()
        token = newUser.generateUserToken()
    })
    afterEach(async () => {
        await server.close()
        await User.deleteMany({})
        await Company.deleteMany({})
    })

    describe('AUTH MIDDLEWARE', () => {
        const exec = () => {
            return request(server)
                .post('/api/companies')
                .set('Authorization', token)
                .send({ name: 'TESTE', type: 'client' })
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
                .post('/api/companies')
                .set('Authorization', token)
                .send({ name: 'TESTE', type: 'client' })
        }
        it('should return 403 if user is not admin', async () => {
            user = {
                full_name: 'Teste Man',
                email: "serginho@gmail.com",
                password: "qwerty123",
                role: 'user',
                company: {
                    _id: newCompany._id,
                    name: newCompany.name
                }
            }

            const newUser = new User(user)
            token = newUser.generateUserToken()

            const res = await exec()
            expect(res.status).toBe(403)
        })

        it('should return 201 if user is admin', async () => {
            const res = await exec()
            expect(res.status).toBe(201)
        })
    })

    describe('GET: /api/companies', () => {
        it('should return all companies', async () => {
            await Company.collection.insertMany([{ name: "Company 1" }, { name: "Company 2" }])

            const res = await request(server)
                .get('/api/companies')
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(res.body.some(c => c.name === 'Company 1')).toBeTruthy()
            expect(res.body.some(c => c.name === 'Company 2')).toBeTruthy()
        })
    })

    describe('GET /api/companies/:id', () => {
        it('should return a company if valid id is passed', async () => {
            const company = new Company({ name: 'Company 1' })
            await company.save()

            const res = await request(server)
                .get(`/api/companies/${company._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('name', company.name)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/companies/1a`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('POST: /api/companies', () => {
        let company
        const exec = () => {
            return request(server)
                .post('/api/companies')
                .set('Authorization', token)
                .send({ name: company.name })
        }
        beforeEach(() => {
            company = { name: "Sergio Junior", }
        })

        it('should return 400 if name is not provied', async () => {
            company.name = ''
            
            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 201 if company is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(201)
        })

        it('should return company if is valid request', async () => {
            const res = await exec()

            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'name'])
            )
        })
    })

    describe('PATCH: /api/companies/:id', () => {
        let resp
        const exec = () => {
            return request(server)
                .patch(`/api/companies/${resp.body._id}`)
                .set('Authorization', token)
                .send({ name: 'TesteName edited' })
        }
        beforeEach(async () => {
            resp = await request(server)
                .post('/api/companies')
                .set('Authorization', token)
                .send({ name: 'company.name' })
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/companies/1`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return company edited if is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.name).toBe('TesteName edited')
            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'name'])
            )
        })
    })

    describe('DELETE: /api/companies/:id', () => {
        let resp
        const exec = () => {
            return request(server)
                .delete(`/api/companies/${resp.body._id}`)
                .set('Authorization', token)
        }

        it('should return 200 if deleted with success', async () => {
            resp = await request(server)
                .post('/api/companies')
                .set('Authorization', token)
                .send({ name: 'company.name' })

            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Delete successfully')
        })
    })

})