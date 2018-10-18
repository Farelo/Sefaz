const request = require('supertest')
const mongoose = require('mongoose')
const { User } = require('../users/users.model')
const { Company } = require('../companies/companies.model')
const { Packing } = require('./packings.model')

describe('api/packings', () => {
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
        await Packing.deleteMany({})
    })

    describe('AUTH MIDDLEWARE', () => {
        const exec = () => {
            return request(server)
                .post('/api/packings')
                .set('Authorization', token)
                .send({ 
                    tag: {
                        code: 'CODE'
                    }, 
                    serial: 'SERIAL' 
                })
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

        it('should return 200 if token is valid', async () => {
            const res = await exec()
            expect(res.status).toBe(200)
        })
    })

    describe('AUTHZ MIDDLEWARE', () => {
        const exec = () => {
            return request(server)
                .post('/api/packings')
                .set('Authorization', token)
                .send({ 
                    tag: {
                        code: 'CODE'
                    }, 
                    serial: 'SERIAL' 
                })
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

        it('should return 200 if user is admin', async () => {
            const res = await exec()
            expect(res.status).toBe(200)
        })
    })

    describe('GET: /api/packings', () => {
        it('should return all packings', async () => {
            await Packing.collection.insertMany([
                { tag: {code: 'teste 1'}, serial: 'teste 1'},
                { tag: {code: 'teste 2'}, serial: 'teste 2'},
                { tag: {code: 'teste 3'}, serial: 'teste 3'}
            ])

            const res = await request(server)
                .get('/api/packings')
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
            expect(res.body.some(p => p.serial === 'teste 1')).toBeTruthy()
            expect(res.body.some(p => p.serial === 'teste 2')).toBeTruthy()
            expect(res.body.some(p => p.serial === 'teste 3')).toBeTruthy()
        })
    })

    describe('GET /api/packings/:id', () => {
        it('should return a packing if valid id is passed', async () => {
            const packing = new Packing({ tag: { code: 'teste 1' }, serial: 'teste 1' })
            await packing.save()

            const res = await request(server)
                .get(`/api/packings/${packing._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('serial', packing.serial)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/packings/1a`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('POST: /api/packings', () => {
        let packing
        const exec = () => {
            return request(server)
                .post('/api/packings')
                .set('Authorization', token)
                .send({ 
                    tag: {
                        code: packing.tag.code
                    }, 
                    serial: packing.serial 
                })
        }
        beforeEach(() => {
            packing = { 
                tag: { 
                    code: 'teste 1' 
                }, 
                serial: 'teste 1' 
            }
        })

        it('should return 400 if tag code is not provied', async () => {
            packing.tag.code = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if serial is not provied', async () => {
            packing.serial = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 200 if packing is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(200)
        })

        it('should return packing if is valid request', async () => {
            const res = await exec()

            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'serial'])
            )
        })
    })

    describe('PATCH: /api/packings/:id', () => {
        let resp
        const exec = () => {
            return request(server)
                .patch(`/api/packings/${resp.body._id}`)
                .set('Authorization', token)
                .send({ 
                    tag: {
                        code: 'CODE edited'
                    }, 
                    serial: 'SERIAL edited' 
                })
        }
        beforeEach(async () => {
            resp = await request(server)
                .post('/api/packings')
                .set('Authorization', token)
                .send({ 
                    tag: {
                        code: 'CODE'
                    }, 
                    serial: 'SERIAL'
                })
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/packings/1`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return packing edited if is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.tag.code).toBe('CODE edited')
            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'serial'])
            )
        })
    })

    describe('DELETE: /api/packings/:id', () => {
        let resp
        const exec = () => {
            return request(server)
                .delete(`/api/packings/${resp.body._id}`)
                .set('Authorization', token)
        }

        it('should return 200 if deleted with success', async () => {
            resp = await request(server)
                .post('/api/packings')
                .set('Authorization', token)
                .send({
                    tag: {
                        code: 'CODE edited'
                    },
                    serial: 'SERIAL edited'
                })

            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Delete successfully')
        })
    })

})