const request = require('supertest')
// const mongoose = require('mongoose')
const { Company } = require('../companies/companies.model')
const { User } = require('../users/users.model')
const { Family } = require('./families.model')

describe('api/families', () => {
    let server
    let token
    let newCompany
    let user
    beforeEach(async () => {
        server = require('../../server')

        newCompany = new Company({ name: 'CEBRACE TESTE' })      
        await newCompany.save()  
        user = {
            full_name: 'Teste Man',
            email: "serginho@gmail.com",
            password: "qwerty123",
            role: 'admin',
            company: {
                _id: newCompany._id,
                name: newCompany.name
            }
        }

        const newUser = new User(user)
        await newUser.save()
        token = newUser.generateUserToken()
    })
    afterEach(async () => {
        await server.close()
        await User.deleteMany({})
        await Company.deleteMany({})
        await Family.deleteMany({})
    })

    describe('AUTH MIDDLEWARE', () => {
        const exec = () => {
            return request(server)
                .post('/api/families')
                .set('Authorization', token)
                .send({ code: 'CODE1', company: newCompany._id })
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
                .post('/api/families')
                .set('Authorization', token)
                .send({ code: 'CODE1', company: newCompany._id })
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

    describe('GET: /api/families', () => {
        it('should return all families', async () => {
            await Family.collection.insertMany([{ code: "Family A" }, { code: "Family B" }])

            const res = await request(server)
                .get('/api/families')
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(res.body.some(c => c.code === 'Family A')).toBeTruthy()
            expect(res.body.some(c => c.code === 'Family B')).toBeTruthy()
        })
    })

    describe('GET /api/families/:id', () => {
        it('should return a family if valid id is passed', async () => {
            const family = new Family({ code: 'CODE1', company: newCompany._id })
            await family.save()

            const res = await request(server)
                .get(`/api/families/${family._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('code', family.code)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/families/1a`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('POST: /api/families', () => {
        let family
        const exec = () => {
            return request(server)
                .post('/api/families')
                .set('Authorization', token)
                .send({ code: family.code, company: family.company })
        }
        beforeEach(() => {
            family = { code: 'CODE1', company: newCompany._id }
        })

        it('should return 400 if code is not provied', async () => {
            family.code = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if family code already exists', async () => {
            await Family.create(family)
            
            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 201 if family is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(201)
        })

        it('should return family if is valid request', async () => {
            const res = await exec()

            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'code'])
            )
        })
    })

    describe('PATCH: /api/families/:id', () => {
        let resp
        const exec = () => {
            return request(server)
                .patch(`/api/families/${resp.body._id}`)
                .set('Authorization', token)
                .send({ code: 'Edited', company: newCompany._id })
        }
        beforeEach(async () => {
            resp = await request(server)
                .post('/api/families')
                .set('Authorization', token)
                .send({ code: 'CODE1', company: newCompany._id })
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/families/1`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return family edited if is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.code).toBe('Edited')
            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'code', 'company'])
            )
        })
    })

    describe('DELETE: /api/families/:id', () => {
        let resp
        const exec = () => {
            return request(server)
                .delete(`/api/families/${resp.body._id}`)
                .set('Authorization', token)
        }

        it('should return 200 if deleted with success', async () => {
            resp = await request(server)
                .post('/api/families')
                .set('Authorization', token)
                .send({ code: 'CODE1', company: newCompany._id })

            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Delete successfully')
        })
    })
})