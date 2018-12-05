const request = require('supertest')
const mongoose = require('mongoose')
const { User } = require('../users/users.model')
const { Company } = require('../companies/companies.model')
const { Family } = require('../families/families.model')
const { Packing } = require('./packings.model')
const _ = require('lodash')

describe('api/packings', () => {
    let server
    let token
    let new_company
    let new_user
    let new_family
    let packing_body
    let new_packing
    let user
    beforeEach(async () => {
        server = require('../../server')

        new_company = new Company({ name: 'CEBRACE TESTE' })
        await new_company.save()
        user = {
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

        new_family = new Family({ code: 'CODE', company: new_company._id })
        await new_family.save()

        packing_body = {
            tag: {
              code: "0001",
              version: "01",
              manufactorer: "teste"
            },
            serial: "teste",
            weigth: 10,
            width: 10,
            heigth: 10,
            length: 10,
            capacity: 10,
            observations: "teste",
            active: true,
            family: new_family._id
        }

        new_packing = new Packing(packing_body)
        new_packing.save()
    })
    afterEach(async () => {
        await server.close()
        await User.deleteMany({})
        await Company.deleteMany({})
        await Family.deleteMany({})
        await Packing.deleteMany({})
    })

    describe('AUTH MIDDLEWARE', () => {
        jest.setTimeout(30000)
        
        describe('Validate token by GET method without id', () => {
            const exec = () => {
                return request(server)
                    .get('/api/packings')
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
                    .get(`/api/packings/${new_packing._id}`)
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
                    .post('/api/packings')
                    .set('Authorization', token)
                    .send(packing_body)
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
                    .patch(`/api/packings/${new_packing._id}`)
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
                    .delete(`/api/packings/${new_packing._id}`)
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

        describe('Validate authorization by POST', () => {
            it('should return 403 if user is not admin by POST', async () => {
                const exec = () => {
                    return request(server)
                        .post('/api/packings')
                        .set('Authorization', tokenUser)
                        .send(packing_body)
                }

                const res = await exec()
                expect(res.status).toBe(403)
            })        
        })

        describe('Validate authorization by GET', () => {
            it('should return 403 if user is not admin by GET', async () => {
                const exec = () => {
                    return request(server)
                        .get('/api/packings')
                        .set('Authorization', tokenUser)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            }) 

            it('should return 403 if user is not admin by GET with id', async () => {
                const exec = () => {
                    return request(server)
                        .get(`/api/packings/${new_packing._id}`)
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
                        .patch(`/api/packings/${new_packing._id}`)
                        .set('Authorization', tokenUser)
                        .send(packing_body)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })
        })

        describe('Validate authorization by DELETE', () => {
            it('should return 403 if user is not admin by DELETE', async () => {
                const exec = () => {
                    return request(server)
                        .delete(`/api/packings/${new_packing._id}`)
                        .set('Authorization', tokenUser)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })
        })
    })

    describe('GET: /api/packings', () => {

        let packing1
        let packing2

        beforeAll(async () => {
            packing1 = {
                tag: {
                  code: "teste 1",
                  version: "01",
                  manufactorer: "teste"
                },
                serial: "teste",
                weigth: 10,
                width: 10,
                heigth: 10,
                length: 10,
                capacity: 10,
                observations: "teste",
                active: true,
                family: new_family._id
            }
            packing2 = {
                tag: {
                  code: "teste 2",
                  version: "01",
                  manufactorer: "teste"
                },
                serial: "teste",
                weigth: 10,
                width: 10,
                heigth: 10,
                length: 10,
                capacity: 10,
                observations: "teste",
                active: true,
                family: new_family._id
            }
        })

        it('should return all packings', async () => {
            
            await Packing.collection.insertMany([
                packing1, packing2
            ])

            let savePackings = await Packing.find({})
            .select(["-created_at", "-update_at", "-__v"])
            .populate("family", ["_id", "code", "company"])
            savePackings = JSON.parse(JSON.stringify(savePackings))

            const res = await request(server)
                .get('/api/packings')
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
            const body = res.body.map((e) => _.omit(e, ["__v", "created_at", "update_at"]))
            expect(body).toEqual(savePackings)
        })

        it('should return 404 if invalid url is passed', async () => { 
            const res = await request(server)
                .get(`/api/packingsss`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('GET /api/packings/:id', () => {
        it('should return a packing if valid id is passed', async () => {
            let packing = {
                _id: new_packing._id,
                absent: false, 
                active: true, 
                capacity: 10, 
                current_state: "analise", 
                family: {
                    _id: new_family._id,
                    code: new_family.code,
                    company: new_company._id
                }, 
                heigth: 10, 
                length: 10, 
                low_battery: false, 
                observations: "teste", 
                permanence_time_exceeded: false, 
                serial: "teste", 
                tag: {
                    code: "0001", 
                    manufactorer: "teste", 
                    version: "01"
                }, 
                temperature: 0, 
                weigth: 10,
                width: 10
            }
            packing = JSON.parse(JSON.stringify(packing))

            const res = await request(server)
                .get(`/api/packings/${new_packing._id}`)
                .set('Authorization', token)

            const body_res = _.omit(res.body, ["__v", "created_at", "update_at"])    

            expect(res.status).toBe(200)
            expect(body_res).toEqual(packing)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/packings/1a`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid url with valid id is passed', async () => { 
            const res = await request(server)
                .get(`/api/packingsss/${new_packing._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('POST: /api/packings', () => {
        
        const exec = () => {
            return request(server)
                .post('/api/packings')
                .set('Authorization', token)
                .send(packing_body)
        }

        beforeEach(async () => {
            packing_body = {
                tag: {
                  code: "0001",
                  version: "01",
                  manufactorer: "teste"
                },
                serial: "teste",
                weigth: 10,
                width: 10,
                heigth: 10,
                length: 10,
                capacity: 10,
                observations: "teste",
                active: true,
                family: new_family._id
            }
        })

        it('should return 400 if requeired attributes is not provied', async () => {
            packing_body.tag.code = ''
            packing_body.serial = ''

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"code\" is not allowed to be empty",
                "\"code\" length must be at least 4 characters long",
                "\"serial\" is not allowed to be empty",
                "\"serial\" length must be at least 2 characters long"
            ])
        })

        it('should return 201 if route is valid request', async () => {
            /*packing_body.tag.code = 'Create test'
            let packing = await Packing.findOne({}, {_id: 0, __v: 0, created_at: 0, update_at: 0})
            packing = JSON.parse(JSON.stringify(packing))
                                
            const res = await exec()
            const body_res = _.omit(res.body, ["_id", "__v", "created_at", "update_at"])
                            
            expect(res.status).toBe(201)
            expect(body_res).toEqual(packing)*/
        })

        it('should return 400 if is body is empty', async () => {
            const exec = () => {
                return request(server)
                    .post('/api/packings')
                    .set('Authorization', token)
                    .send({})
            }

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"serial\" is required",
                "\"family\" is required"
            ])
        })

        it('should return 400 if is unknow key is provied', async () => {
           packing_body.test = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 404 if invalid url is provied', async () => {
            const exec = () => {
                return request(server)
                    .post('/api/packingssss')
                    .set('Authorization', token)
                    .send(packing_body)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 400 if attributes values above the limits', async () => {
            packing_body.tag.code = 'asdfasdfasdfasdfasdfasdfas'
            packing_body.tag.version = 'asdfasdfasdfasdfasdfasdfasasdfa'
            packing_body.tag.manufactorer = 'asdfasdfasdfasdfasdfasdfasasdfa'
            packing_body.serial = 'asdfasdfasdfasdfasdfasdfasasdfa'
            packing_body.weigth = 10001
            packing_body.width = 10001
            packing_body.heigth = 10001
            packing_body.length = 10001
            packing_body.capacity = 10001
            packing_body.observations = 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfaa'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"code\" length must be less than or equal to 25 characters long",
                "\"version\" length must be less than or equal to 30 characters long",
                "\"manufactorer\" length must be less than or equal to 30 characters long",
                "\"serial\" length must be less than or equal to 30 characters long",
                "\"weigth\" must be less than or equal to 10000",
                "\"width\" must be less than or equal to 10000",
                "\"heigth\" must be less than or equal to 10000",
                "\"length\" must be less than or equal to 10000",
                "\"capacity\" must be less than or equal to 10000"
            ])
        })

        it('should return 400 if attributes values below the limits', async () => {
            packing_body.tag.code = '001'
            packing_body.tag.version = ''
            packing_body.tag.manufactorer = 'a'
            packing_body.serial = 'a'
            packing_body.weigth = -1
            packing_body.width = -1
            packing_body.length = -1
            packing_body.capacity = -1
            packing_body.observations = ''

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"code\" length must be at least 4 characters long",
                "\"version\" is not allowed to be empty",
                "\"version\" length must be at least 1 characters long",
                "\"manufactorer\" length must be at least 2 characters long",
                "\"serial\" length must be at least 2 characters long",
                "\"observations\" is not allowed to be empty"
            ])
        })

        it('should return 400 if id attributes are invalid', async () => {
            packing_body.family = "asd"

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"family\" with value \"asd\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/"
            ])
        })

        it('should return 400 if the attribute types diferent than expected', async () => {
            packing_body.tag.code = 11
            packing_body.tag.version = 11
            packing_body.tag.manufactorer = 11
            packing_body.serial = 11
            packing_body.weigth = 'asd'
            packing_body.width = 'asd'
            packing_body.length = 'asd'
            packing_body.heigth = 'asd'
            packing_body.capacity = 'asd'
            packing_body.observations = 11
            packing_body.active = 11
            packing_body.family = 11

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"code\" must be a string",
                "\"version\" must be a string",
                "\"manufactorer\" must be a string",
                "\"serial\" must be a string",
                "\"weigth\" must be a number",
                "\"width\" must be a number",
                "\"heigth\" must be a number",
                "\"length\" must be a number",
                "\"capacity\" must be a number",
                "\"observations\" must be a string",
                "\"active\" must be a boolean",
                "\"family\" must be a string"
            ])
        })
    })

    describe('PATCH: /api/packings/:id', () => {
        
        const exec = () => {
            return request(server)
                .patch(`/api/packings/${new_packing._id}`)
                .set('Authorization', token)
                .send(packing_body)
        }

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .patch(`/api/packings/1`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return 400 if required attributes is not provied', async () => {
            packing_body.tag.code = ''
            packing_body.serial = ''

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"code\" is not allowed to be empty",
                "\"code\" length must be at least 4 characters long",
                "\"serial\" is not allowed to be empty",
                "\"serial\" length must be at least 2 characters long"
            ])
        })

        it('should return 200 if type is valid request', async () => {
            let packing = {
                _id: new_packing._id,
                absent: false, 
                active: true, 
                capacity: 10, 
                current_state: "analise", 
                family: new_family._id, 
                heigth: 10, 
                length: 10, 
                low_battery: false, 
                observations: "teste", 
                permanence_time_exceeded: false, 
                serial: "teste", 
                tag: {
                    code: "0001", 
                    manufactorer: "teste", 
                    version: "01"
                }, 
                temperature: 0, 
                weigth: 10,
                width: 10
            }
            packing = JSON.parse(JSON.stringify(packing))
                                
            const res = await exec()
            const body_res = _.omit(res.body, ["__v", "created_at", "update_at"])
                            
            expect(res.status).toBe(200)
            expect(body_res).toEqual(packing)
        })

        it('should return 400 if is body is empty', async () => {
            const exec = () => {
                return request(server)
                    .patch(`/api/packings/${new_packing._id}`)
                    .set('Authorization', token)
                    .send({})
            }

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"serial\" is required",
                "\"family\" is required"
            ])
        })

        it('should return 400 if is unknow key is provied', async () => {
            packing_body.test = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 404 if invalid url is provied', async () => {
            const exec = () => {
                return request(server)
                    .post('/api/packingssss')
                    .set('Authorization', token)
                    .send(packing_body)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 400 if attributes values above the limits', async () => {
            packing_body.tag.code = 'asdfasdfasdfasdfasdfasdfas'
            packing_body.tag.version = 'asdfasdfasdfasdfasdfasdfasasdfa'
            packing_body.tag.manufactorer = 'asdfasdfasdfasdfasdfasdfasasdfa'
            packing_body.serial = 'asdfasdfasdfasdfasdfasdfasasdfa'
            packing_body.weigth = 10001
            packing_body.width = 10001
            packing_body.heigth = 10001
            packing_body.length = 10001
            packing_body.capacity = 10001
            packing_body.observations = 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfaa'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"code\" length must be less than or equal to 25 characters long",
                "\"version\" length must be less than or equal to 30 characters long",
                "\"manufactorer\" length must be less than or equal to 30 characters long",
                "\"serial\" length must be less than or equal to 30 characters long",
                "\"weigth\" must be less than or equal to 10000",
                "\"width\" must be less than or equal to 10000",
                "\"heigth\" must be less than or equal to 10000",
                "\"length\" must be less than or equal to 10000",
                "\"capacity\" must be less than or equal to 10000"
            ])
        })

        it('should return 400 if attributes values below the limits', async () => {
            packing_body.tag.code = '001'
            packing_body.tag.version = ''
            packing_body.tag.manufactorer = 'a'
            packing_body.serial = 'a'
            packing_body.weigth = -1
            packing_body.width = -1
            packing_body.length = -1
            packing_body.capacity = -1
            packing_body.observations = ''

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"code\" length must be at least 4 characters long",
                "\"version\" is not allowed to be empty",
                "\"version\" length must be at least 1 characters long",
                "\"manufactorer\" length must be at least 2 characters long",
                "\"serial\" length must be at least 2 characters long",
                "\"observations\" is not allowed to be empty"
            ])
        })

        it('should return 400 if id attributes are invalid', async () => {
            packing_body.family = "asd"

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"family\" with value \"asd\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/"
            ])
        })

        it('should return 400 if the attribute types diferent than expected', async () => {
            packing_body.tag.code = 11
            packing_body.tag.version = 11
            packing_body.tag.manufactorer = 11
            packing_body.serial = 11
            packing_body.weigth = 'asd'
            packing_body.width = 'asd'
            packing_body.length = 'asd'
            packing_body.heigth = 'asd'
            packing_body.capacity = 'asd'
            packing_body.observations = 11
            packing_body.active = 11
            packing_body.family = 11

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"code\" must be a string",
                "\"version\" must be a string",
                "\"manufactorer\" must be a string",
                "\"serial\" must be a string",
                "\"weigth\" must be a number",
                "\"width\" must be a number",
                "\"heigth\" must be a number",
                "\"length\" must be a number",
                "\"capacity\" must be a number",
                "\"observations\" must be a string",
                "\"active\" must be a boolean",
                "\"family\" must be a string"
            ])
        })
    })

    describe('DELETE: /api/packings/:id', () => {

        let exec = () => {
            return request(server)
                .delete(`/api/packings/${new_packing._id}`)
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
            expect(res.body.message).toBe('Invalid packing')
        })

        it('should return 404 if url invalid is provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/packingsss/${new_packing._id}`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid id is provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/packings/aa`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if id is not provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/packings/`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })
    })

})