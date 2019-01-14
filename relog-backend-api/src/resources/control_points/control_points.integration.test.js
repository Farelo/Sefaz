const request = require('supertest')
const mongoose = require('mongoose')
const { User } = require('../users/users.model')
const { Company } = require('../companies/companies.model')
const { Type } = require('../types/types.model')
const { ControlPoint } = require('./control_points.model')
const _ = require('lodash')

describe('api/control_points', () => {
    let server
    let token
    let new_company
    let new_user
    let new_type
    let control_point_body
    let control_point

    beforeEach(async () => {
        server = require('../../server')

        new_company = await Company.create({
            name: "company teste",
            phone: "1111111111",
            cnpj: "12345678912345",
            address: {
                city: "Recife",
                street: "Rua teste",
                cep: "54222699",
                uf: "PE"
            },
            type: "owner"
        })

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
        new_type = await Type.create({name: 'Factory'})

        token = new_user.generateUserToken()

        control_point_body = {
            name: "point test",
            geofence: {
                coordinates: [{ lat: 50, lng: 50 }],
                type: 'c',
                radius: 1000
            },
            full_address: "teste",
            type: new_type.id,
            company: new_company._id
        }

        control_point = new ControlPoint(control_point_body)
    })
    afterEach(async () => {
        await server.close()
        await Company.deleteMany({})
        await User.deleteMany({})
        await Type.deleteMany({})
        await ControlPoint.deleteMany({})
    })

    describe('GET: /api/control_points', () => {
        it('should return all control points', async () => {
            await ControlPoint.collection.insertMany([
                {
                    name: "point 1",
                    geofence: {
                        coordinates: [{ lat: 50, lng: 50 }],
                        type: 'c',
                        radius: 1000
                    },
                    full_address: "teste",
                    type: new_type._id,
                    company: new_company._id
                },
                {
                    name: "point 2",
                    geofence: {
                        coordinates: [{ lat: 50, lng: 50 }],
                        type: 'c',
                        radius: 1000
                    },
                    full_address: "teste",
                    type: new_type._id,
                    company: new_company._id
                }
            ])

            const res = await request(server)
                .get('/api/control_points')
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
        })

        it('should return 404 if invalid url is passed', async () => { 
            const res = await request(server)
                .get(`/api/control_pointsss`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('GET /api/control_points/:id', () => {
        it('should return a control_point if valid id is passed', async () => {
            control_point.save()

            const res = await request(server)
                .get(`/api/control_points/${control_point._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/control_points/1a`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid url with valid id is passed', async () => { 
            const res = await request(server)
                .get(`/api/control_pointsss/${control_point._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('POST: /api/control_points', () => {
        const exec = () => {
            return request(server)
                .post('/api/control_points')
                .set('Authorization', token)
                .send(control_point_body)
        }

        it('should return 201 if type is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(201)
        })

        it('should return 400 if required attributes is not provied', async () => {
            control_point_body.name = ""
            control_point_body.type = ""
            control_point_body.company = ""

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" is not allowed to be empty",
                "\"name\" length must be at least 5 characters long",
                "\"type\" is not allowed to be empty",
                "\"type\" with value \"\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/",
                "\"company\" is not allowed to be empty",
                "\"company\" with value \"\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/"
            ])
        })

        it('should return 400 if control_point name already exists', async () => {
            control_point.save()

            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.body.message).toBe("Control Point already exists with this name.")
        })

        it('should return 400 if is body is empty', async () => {
            const exec = () => {
                return request(server)
                    .post('/api/control_points')
                    .set('Authorization', token)
                    .send({})
            }

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" is required",
                "\"type\" is required",
                "\"company\" is required"
            ])
        })

        it('should return 400 if is unknow key is provied', async () => {
            control_point_body.test = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 404 if invalid url is provied', async () => {
            const exec = () => {
                return request(server)
                    .post('/api/control_pointsss')
                    .set('Authorization', token)
                    .send(control_point_body)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })
    })

    describe('PATCH: /api/control_points/:id', () => {
        const exec = () => {
            return request(server)
                .patch(`/api/control_points/${control_point._id}`)
                .set('Authorization', token)
                .send(control_point_body)
        }
        
        it('should return 404 if invalid id is passed', async () => {
            control_point.save()

            const res = await request(server)
                .patch(`/api/control_points/1`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return 400 if required attributes is not provied', async () => {
            control_point_body.name = ''
            control_point_body.type = ''
            control_point_body.company = ''

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" is not allowed to be empty",
                "\"name\" length must be at least 5 characters long",
                "\"type\" is not allowed to be empty",
                "\"type\" with value \"\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/",
                "\"company\" is not allowed to be empty",
                "\"company\" with value \"\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/"
            ])
        })

        it('should return 200 if type is valid request', async () => {
            control_point.save()
            control_point_body.name = 'edited'

            const res = await exec()
                            
            expect(res.status).toBe(200)
        })

        it('should return 400 if is body is empty', async () => {
            control_point_body = {}

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" is required",
                "\"type\" is required",
                "\"company\" is required"
            ])
        })

        it('should return 400 if is unknow key is provied', async () => {
            control_point_body.test = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 404 if invalid url is provied', async () => {
            const exec = () => {
                return request(server)
                    .post(`/api/control_pointsss/${control_point._id}`)
                    .set('Authorization', token)
                    .send(control_point_body)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })
    })

    describe('DELETE: /api/control_points/:id', () => {
        exec = () => {
            return request(server)
                .delete(`/api/control_points/${control_point._id}`)
                .set('Authorization', token)
        }

        it('should return 200 if deleted with success', async () => {
            control_point.save()
            
            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Delete successfully')
        })

        it('should return 400 if deleted type nonexistent', async () => {
            await exec()
            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('Invalid control_point.')
        })

        it('should return 404 if url invalid is provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/control_pointsss/${control_point._id}`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid id is provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/control_points/aa`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if id is not provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/control_points/`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })
    })
})