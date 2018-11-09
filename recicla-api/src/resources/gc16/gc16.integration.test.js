const request = require('supertest')
const mongoose = require('mongoose')
const { User } = require('../users/users.model')
const { Company } = require('../companies/companies.model')
const { Family } = require('../families/families.model')
const { GC16 } = require('./gc16.model')

describe('api/gc16', () => {
    let server
    let token
    let new_company
    let new_user
    let new_family
    let gc16_body
    
    beforeEach(async () => {
        server = require('../../server')

        new_company = new Company({ name: 'CEBRACE TESTE' })
        await new_company.save()
        const user = {
            full_name: 'Teste Man',
            email: "serginho@gmail.com",
            password: "qwerty123",
            role: 'admin',
            company: {
                _id: new_company._id,
                name: new_company.name
            }
        }

        new_user = new User(user)
        await new_user.save()

        token = new_user.generateUserToken()

        new_family = new Family({ code: 'CODE1', company: new_company._id })
        await new_family.save()

        gc16_body = {
            annual_volume: 10,
            family: new_family._id
        }
    })
    afterEach(async () => {
        await server.close()
        await User.deleteMany({})
        await Company.deleteMany({})
        await Family.deleteMany({})
        await GC16.deleteMany({})
    })

    describe('GET: /api/gc16', () => {
        it('should return all gc16', async () => {
            const another_family = new Family({ code: 'CODE2', company: new_company._id })
            await another_family.save()

            await GC16.collection.insertMany([
                { annual_volume: 10, family: new_family._id },
                { annual_volume: 11, family: another_family._id }
            ])

            const res = await request(server)
                .get('/api/gc16')
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(res.body.some(gc => gc.annual_volume === 10)).toBeTruthy()
            expect(res.body.some(gc => gc.annual_volume === 11)).toBeTruthy()
        })
    })

    describe('GET /api/gc16/:id', () => {
        it('should return 200 a gc16 if valid id is passed', async () => {
            const gc16 = new GC16({ annual_volume: 10, family: new_family._id })
            await gc16.save()

            const res = await request(server)
                .get(`/api/gc16/${gc16._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('annual_volume', gc16.annual_volume)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/gc16/1a`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('POST: /api/gc16', () => {
        let gc16
        const exec = () => {
            return request(server)
                .post('/api/gc16')
                .set('Authorization', token)
                .send({
                    annual_volume: gc16.annual_volume,
                    family: gc16.family
                })
        }
        beforeEach(() => {
            gc16 = {
                annual_volume: 10,
                family: new_family._id
            }
        })

        it('should return 400 if family is not provied', async () => {
            gc16.family = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if gc16 code tag already exists', async () => {
            await GC16.create(gc16)

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 201 if gc16 is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(201)
        })

        it('should return gc16 if is valid request', async () => {
            const res = await exec()

            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'family'])
            )
        })
    })
})
