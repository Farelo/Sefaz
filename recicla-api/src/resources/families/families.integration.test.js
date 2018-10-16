const request = require('supertest')
// const mongoose = require('mongoose')
const { Company } = require('../companies/companies.model')
const { User } = require('../users/users.model')
const { Family } = require('./families.model')

describe('api/families', () => {
    let server
    let token
    beforeEach(async () => {
        server = require('../../server')

        newCompany = new Company({ name: 'CEBRACE TESTE' })      
        await newCompany.save()  
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
                .send({ code: 'TESTE' })
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

    // describe('AUTHZ MIDDLEWARE', () => {
    //     it('teste', async () => {
    //         expect(true).toBe(true)
    //     })
    // })

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

})