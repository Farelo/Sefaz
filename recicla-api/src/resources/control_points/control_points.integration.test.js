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
            lat: 50,
            lng: 50,
            full_address: "teste",
            type: new_type.id,
            company: new_company._id
        }

        control_point = new ControlPoint(control_point_body)
        control_point.save()
    })
    afterEach(async () => {
        await server.close()
        await Company.deleteMany({})
        await User.deleteMany({})
        await Type.deleteMany({})
        await ControlPoint.deleteMany({})
    })

    describe('AUTH MIDDLEWARE', () => {
        jest.setTimeout(30000)
        
        describe('Validate token by GET method without id', () => {
            const exec = () => {
                return request(server)
                    .get('/api/control_points')
                    .set('Authorization', token)
            }

            it('should return 401 if no token is provided', async () => {
                token = ''
                const res = await exec()
                expect(res.status).toBe(401)
                expect(res.body.message).toBe('Access denied. No token provided.')
            })

            it('should return 400 if token is invalid', async () => {
                token = 'a'
                const res = await exec()
                expect(res.status).toBe(400)
                expect(res.body.message).toBe('Invalid token.')
            })

            /*it('should return 401 if token is expired', async () => {
                token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                'eyJfaWQiOiI1YmM4OTViZTJhYzUyMzI5MDAyMjA4ODQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1Mzk4ODg2MTJ9.' +
                'RjCQrcM99f9bi_zST1RlxHQ3TNBHFiOyMTcf1Mi7u8I'
                const res = await exec()
                expect(res.status).toBe(401)
                expect(res.body.message).toBe('Access denied. Token expired.')
            })*/
        })

        describe('Validate token by GET method with id', () => {
            const exec = () => {
                return request(server)
                    .get(`/api/control_points/${control_point._id}`)
                    .set('Authorization', token)
            }

            it('should return 401 if no token is provided', async () => {
                token = ''
                const res = await exec()
                expect(res.status).toBe(401)
                expect(res.body.message).toBe('Access denied. No token provided.')
            })

            it('should return 400 if token is invalid', async () => {
                token = 'a'
                const res = await exec()
                expect(res.status).toBe(400)
                expect(res.body.message).toBe('Invalid token.')
            })

            /*it('should return 401 if token is expired', async () => {
                
                token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                'eyJfaWQiOiI1YmM4OTViZTJhYzUyMzI5MDAyMjA4ODQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1Mzk4ODg2MTJ9.' +
                'RjCQrcM99f9bi_zST1RlxHQ3TNBHFiOyMTcf1Mi7u8I'
            
                const res = await exec()
                expect(res.status).toBe(401)
                expect(res.body.message).toBe('Access denied. Token expired.')
            })*/
        })

        describe('Validate token by POST method', () => {
            const exec = () => {
                return request(server)
                    .post('/api/control_points')
                    .set('Authorization', token)
                    .send(control_point_body)
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

            /*it('should return 401 if token is expired', async () => {
                
                token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                'eyJfaWQiOiI1YmM4OTViZTJhYzUyMzI5MDAyMjA4ODQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1Mzk4ODg2MTJ9.' +
                'RjCQrcM99f9bi_zST1RlxHQ3TNBHFiOyMTcf1Mi7u8I'
                
                const res = await exec()
                expect(res.status).toBe(401)
                expect(res.body.message).toBe('Access denied. Token expired.')
            })*/
        })

        describe('Validate token by PATCH method', () => {
            const exec = () => {
                return request(server)
                    .patch(`/api/control_points/${control_point._id}`)
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
            /*it('should return 401 if token is expired', async () => {
                
                token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                'eyJfaWQiOiI1YmM4OTViZTJhYzUyMzI5MDAyMjA4ODQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1Mzk4ODg2MTJ9.' +
                'RjCQrcM99f9bi_zST1RlxHQ3TNBHFiOyMTcf1Mi7u8I'
                
                const res = await exec()
                expect(res.status).toBe(401)
                expect(res.body.message).toBe('Access denied. Token expired.')
            })*/
        })

        describe('Validate token by DELETE method', () => {
            const exec = () => {
                return request(server)
                    .delete(`/api/control_points/${control_point._id}`)
                    .set('Authorization', token)
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
            /*it('should return 401 if token is expired', async () => {
                
                token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                'eyJfaWQiOiI1YmM4OTViZTJhYzUyMzI5MDAyMjA4ODQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1Mzk4ODg2MTJ9.' +
                'RjCQrcM99f9bi_zST1RlxHQ3TNBHFiOyMTcf1Mi7u8I'
                
                const res = await exec()
                expect(res.status).toBe(401)
                expect(res.body.message).toBe('Access denied. Token expired.')
            })*/
        })
    })

    describe('AUTHZ MIDDLEWARE', () => {
        const new_company = new Company({ 
            name: "Company 1",
            cnpj: "91289532000146",
            phone: "11111111111",
            address: {
                city: "Recife",
                street: "Rua teste",
                cep: "54280222",
                uf: "PE"
            }})
        new_company.save()
        const userUser = {
                    full_name: 'Teste Man 3',
                    email: "testet@gmail.com",
                    password: "qwerty123",
                    role: 'user',
                    company: {
                        _id: new_company._id,
                        name: new_company.name
                    }
                }
        const newUser = new User(userUser)
        const tokenUser = newUser.generateUserToken()
        newUser.save()

        describe('Validate authorization by POST', () => {
            it('should return 403 if user is not admin by POST', async () => {
                const exec = () => {
                    return request(server)
                        .post('/api/control_points')
                        .set('Authorization', tokenUser)
                        .send(control_point_body)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })        
        })

        describe('Validate authorization by GET', () => {
            it('should return 403 if user is not admin by GET', async () => {
                const exec = () => {
                    return request(server)
                        .get('/api/control_points')
                        .set('Authorization', tokenUser)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })

            it('should return 403 if user is not admin by GET with id', async () => {
                const exec = () => {
                    return request(server)
                        .get(`/api/control_points/${newUser._id}`)
                        .set('Authorization', tokenUser)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })        
        })

        describe('Validate authorization by PATCH', () => {
            it('should return 403 if user is not admin by PATCH', async () => {
                const exec = () => {
                    return request(server)
                        .patch(`/api/control_points/${newUser._id}`)
                        .set('Authorization', tokenUser)
                        .send({full_name: "teste"})
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })
        })

        describe('Validate authorization by DELETE', () => {
            it('should return 403 if user is not admin by DELETE', async () => {
                const exec = () => {
                    return request(server)
                        .delete(`/api/control_points/${newUser._id}`)
                        .set('Authorization', tokenUser)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })
        })
    })

    describe('GET: /api/control_points', () => {
        it('should return all control points', async () => {
            await ControlPoint.collection.insertMany([
                {
                    name: "point 1",
                    lat: 50,
                    lng: 50,
                    full_address: "teste",
                    type: new_type._id,
                    company: new_company._id
                },
                {
                    name: "point 2",
                    lat: 50,
                    lng: 50,
                    full_address: "teste",
                    type: new_type._id,
                    company: new_company._id
                }
            ])

            let saveControlPoint = await ControlPoint.find({})
            .select(["-created_at", "-update_at", "-__v"])
                    .populate("company", ['_id', 'name', 'address', 'phone', 'cnpj', 'type'])
                    .populate("type", ['_id', 'name'])
            saveControlPoint = JSON.parse(JSON.stringify(saveControlPoint))

            const res = await request(server)
                .get('/api/control_points')
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
            const body = res.body.map((e) => _.omit(e, ["__v", "created_at", "update_at", 
                "company.__v", "company.created_at", "company.update_at"]))
            expect(body).toEqual(saveControlPoint)
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
            const res = await request(server)
                .get(`/api/control_points/${control_point._id}`)
                .set('Authorization', token)

            const body_res = _.omit(res.body, ["__v", "created_at", "update_at", "company.created_at", 
                                        "company.update_at","company.__v"])
            let body_toEqual = {
                _id: control_point._id,
                name: control_point_body.name,
                lat: control_point_body.lat,
                lng: control_point_body.lng,
                full_address: control_point_body.full_address,
                type: {
                    _id: new_type._id,
                    name: new_type.name
                },
                company: {
                    address: {
                      cep: new_company.address.cep,
                      city: new_company.address.city,
                      street: new_company.address.street,
                      uf: new_company.address.uf
                    },
                    type: new_company.type,
                    _id: control_point.company._id,
                    name: new_company.name,
                    phone: new_company.phone,
                    cnpj: new_company.cnpj
                }
            }
            body_toEqual = JSON.parse(JSON.stringify(body_toEqual))
            expect(res.status).toBe(200)
            expect(body_res).toEqual(body_toEqual)
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

        it('should return 201 if type is valid request', async () => {
            control_point_body.name = 'control point create test'
            
            const res = await exec()
            const body_res = _.omit(res.body, ["_id", "__v", "created_at", "update_at"])
                        
            expect(res.status).toBe(201)
            expect(body_res).toEqual(JSON.parse(JSON.stringify(control_point_body)))
        })

        it('should return 400 if control_point name already exists', async () => {

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

        it('should return 400 if attributes values above the limits', async () => {
            control_point_body.name = 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasd'
            control_point_body.lat = 91
            control_point_body.lng = 181
            control_point_body.full_address = 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasd'
        
            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" length must be less than or equal to 50 characters long",
                "\"lat\" must be less than or equal to 90",
                "\"lng\" must be less than or equal to 180",
                "\"full_address\" length must be less than or equal to 100 characters long"
            ])
        })

        it('should return 400 if attributes values below the limits', async () => {
            control_point_body.name = 'test'
            control_point_body.lat = -91
            control_point_body.lng = -181
            control_point_body.full_address = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" length must be at least 5 characters long",
                "\"lat\" must be larger than or equal to -90",
                "\"lng\" must be larger than or equal to -180",
                "\"full_address\" length must be at least 5 characters long"
            ])
        })

        it('should return 400 if the attribute types diferent than expected', async () => {
            control_point_body.name = 11
            control_point_body.lat = 'as'
            control_point_body.lng = 'as'
            control_point_body.full_address = 11

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" must be a string",
                "\"lat\" must be a number",
                "\"lng\" must be a number",
                "\"full_address\" must be a string"
            ])
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
            control_point_body.name = 'edited'

            const res = await exec()
            const body_res = _.omit(res.body, ["_id", "__v", "created_at", "update_at"])
                            
            expect(res.status).toBe(200)
            expect(body_res).toEqual(JSON.parse(JSON.stringify(control_point_body)))
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

        it('should return 400 if attributes values above the limits', async () => {
            control_point_body.name = 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasd'
            control_point_body.lat = 91
            control_point_body.lng = 181
            control_point_body.full_address = 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasd'
        
            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" length must be less than or equal to 50 characters long",
                "\"lat\" must be less than or equal to 90",
                "\"lng\" must be less than or equal to 180",
                "\"full_address\" length must be less than or equal to 100 characters long"
            ])
        })

        it('should return 400 if attributes values below the limits', async () => {
            control_point_body.name = 'test'
            control_point_body.lat = -91
            control_point_body.lng = -181
            control_point_body.full_address = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" length must be at least 5 characters long",
                "\"lat\" must be larger than or equal to -90",
                "\"lng\" must be larger than or equal to -180",
                "\"full_address\" length must be at least 5 characters long"
            ])
        })

        it('should return 400 if the attribute types diferent than expected', async () => {
            control_point_body.name = 11
            control_point_body.lat = 'as'
            control_point_body.lng = 'as'
            control_point_body.full_address = 11

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" must be a string",
                "\"lat\" must be a number",
                "\"lng\" must be a number",
                "\"full_address\" must be a string"
            ])
        })
    })

    describe('DELETE: /api/control_points/:id', () => {
        
        exec = () => {
            return request(server)
                .delete(`/api/control_points/${control_point._id}`)
                .set('Authorization', token)
        }

        it('should return 200 if deleted with success', async () => {
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