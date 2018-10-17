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

    // describe('AUTH MIDDLEWARE', () => {
    //     const exec = () => {
    //         return request(server)
    //             .post('/api/packings')
    //             .set('Authorization', token)
    //             .send({ code: 'CODE1', company: newCompany._id })
    //     }
    //     it('should return 401 if no token is provided', async () => {
    //         token = ''
    //         const res = await exec()
    //         expect(res.status).toBe(401)
    //     })

    //     it('should return 400 if token is invalid', async () => {
    //         token = 'a'
    //         const res = await exec()
    //         expect(res.status).toBe(400)
    //     })

    //     it('should return 200 if token is valid', async () => {
    //         const res = await exec()
    //         expect(res.status).toBe(200)
    //     })
    // })

    // describe('AUTHZ MIDDLEWARE', () => {
    //     const exec = () => {
    //         return request(server)
    //             .post('/api/families')
    //             .set('Authorization', token)
    //             .send({ code: 'CODE1', company: newCompany._id })
    //     }
    //     it('should return 403 if user is not admin', async () => {
    //         user = {
    //             full_name: 'Teste Man',
    //             email: "serginho@gmail.com",
    //             password: "qwerty123",
    //             role: 'user',
    //             company: {
    //                 _id: newCompany._id,
    //                 name: newCompany.name
    //             }
    //         }

    //         const newUser = new User(user)
    //         token = newUser.generateUserToken()

    //         const res = await exec()
    //         expect(res.status).toBe(403)
    //     })

    //     it('should return 200 if user is admin', async () => {
    //         const res = await exec()
    //         expect(res.status).toBe(200)
    //     })
    // })

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

})