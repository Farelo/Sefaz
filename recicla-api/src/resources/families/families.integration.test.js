const request = require('supertest')
// const mongoose = require('mongoose')
const { Company } = require('../companies/companies.model')
const { User } = require('../users/users.model')
const { Family } = require('./families.model')
const _ = require('lodash')

describe('api/families', () => {
    let server
    let token
    let newCompany
    let user
    let family_body
    let new_family
    beforeEach(async () => {
        server = require('../../server')

        newCompany = new Company({
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
        await newCompany.save()      
        user = {
            full_name: 'Teste Man',
            email: "serginho@gmail.com",
            password: "qwerty123",
            role: 'admin',
            company: newCompany._id
        }

        const newUser = new User(user)
        await newUser.save()
        token = newUser.generateUserToken()

        family_body = {
            code: "family test",
            company: newCompany._id
        }

        new_family = new Family({
            code: "family test",
            company: newCompany._id
        })
        new_family.save()
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

        /*it('should return 401 if token is expired', async () => {
                token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                'eyJfaWQiOiI1YmM4OTViZTJhYzUyMzI5MDAyMjA4ODQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1Mzk4ODg2MTJ9.' +
                'RjCQrcM99f9bi_zST1RlxHQ3TNBHFiOyMTcf1Mi7u8I'
                const res = await exec()
                expect(res.status).toBe(401)
                expect(res.body.message).toBe('Access denied. Token expired.')
        })*/
    })

    describe('AUTHZ MIDDLEWARE', () => {
        
        let newUser
        let tokenUser
        beforeAll(async () => {
            user.role = 'user'
            user.email = 'test@test.com'
            newUser = new User(user)
            tokenUser = newUser.generateUserToken()
            newUser.save()
        })

        describe('Validate authorization by POST', () => {
            it('should return 403 if user is not admin by POST', async () => {
                const exec = () => {
                    return request(server)
                        .post('/api/families')
                        .set('Authorization', tokenUser)
                        .send(family_body)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })        
        })

        describe('Validate authorization by GET', () => {
            it('should return 403 if user is not admin by GET', async () => {
                const exec = () => {
                    return request(server)
                        .get('/api/families')
                        .set('Authorization', tokenUser)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })

            it('should return 403 if user is not admin by GET with id', async () => {
                const exec = () => {
                    return request(server)
                        .get(`/api/families/${newUser._id}`)
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
                        .patch(`/api/families/${newUser._id}`)
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
                        .delete(`/api/families/${newUser._id}`)
                        .set('Authorization', tokenUser)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })
        })
    })

    describe('GET: /api/families', () => {
        it('should return all control points', async () => {
            await Family.collection.insertMany([
                {
                    code: "family 1",
                    company: newCompany._id
                },
                {
                    code: "family 2",
                    company: newCompany._id
                }
            ])

            let saveFamilies = await Family.find({})
            .select(["-created_at", "-update_at", "-__v"]).populate("company", ['_id', 'name', 'type'])
            saveFamilies = JSON.parse(JSON.stringify(saveFamilies))

            const res = await request(server)
                .get('/api/families')
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
            const body = res.body.map((e) => _.omit(e, ["__v", "created_at", "update_at"]))
            expect(body).toEqual(saveFamilies)
        })

        it('should return 404 if invalid url is passed', async () => { 
            const res = await request(server)
                .get(`/api/familiesss`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('GET /api/families/:id', () => {

        it('should return a type if valid id is passed', async () => {
            const res = await request(server)
                .get(`/api/families/${new_family._id}`)
                .set('Authorization', token)

            const body_res = _.omit(res.body, ["__v", "created_at", "update_at"])
            let body_toEqual = {
                routes: [],
                control_points: [],
                _id: new_family._id,
                code: "family test",
                company: {
                    type: newCompany.type,
                    _id: newCompany._id,
                    name: newCompany.name
                }
            }
            body_toEqual = JSON.parse(JSON.stringify(body_toEqual))
            expect(res.status).toBe(200)
            expect(body_res).toEqual(body_toEqual)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/families/1a`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid url with valid id is passed', async () => { 
            const res = await request(server)
                .get(`/api/familiessss/${new_family._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('POST: /api/families', () => {
        
        const exec = () => {
            return request(server)
                .post('/api/families')
                .set('Authorization', token)
                .send(family_body)
        }
    
        it('should return 400 if required attributes is not provied', async () => {
            family_body.code = ''
            family_body.company = ''

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"code\" is not allowed to be empty",
                "\"code\" length must be at least 3 characters long",
                "\"company\" is not allowed to be empty",
                "\"company\" with value \"\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/"
            ])
        })

        it('should return 400 if family code already exists', async () => {
            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.text).toBe("Family already exists with this code.")
        })

        it('should return 201 if family is valid request', async () => {
            family_body.code = '001'
            
            const res = await exec()
            const body_res = _.omit(res.body, ["_id", "__v", "created_at", "update_at",
                    "routes", "control_points"])
    
            expect(res.status).toBe(201)
            expect(body_res).toEqual(JSON.parse(JSON.stringify(family_body)))
        })

        it('should return 400 if is body is empty', async () => {
            const exec = () => {
                return request(server)
                    .post('/api/families')
                    .set('Authorization', token)
                    .send({})
            }

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"code\" is required",
                "\"company\" is required"
            ])
        })

        it('should return 400 if is unknow key is provied', async () => {
            family_body.test = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 404 if invalid url is provied', async () => {
            const exec = () => {
                return request(server)
                    .post('/api/familiesss')
                    .set('Authorization', token)
                    .send(family_body)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 400 if name has large amount of characters', async () => {
            family_body.code = 'asdfasdfasdfasdfasdfasdfas'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"code\" length must be less than or equal to 25 characters long"
            ])
        })

        it('should return 400 if name has small amount of characters', async () => {
            family_body.code = '01'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"code\" length must be at least 3 characters long"
            ])
        })

        it('should return 400 if the attribute types diferent than expected', async () => {
            family_body.code = 11

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"code\" must be a string"
              ])
        })
    })

    describe('PATCH: /api/families/:id', () => {
        
        const exec = () => {
            return request(server)
                .patch(`/api/families/${new_family._id}`)
                .set('Authorization', token)
                .send(family_body)
        }
        
        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .patch(`/api/families/1`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return 400 if required attributes is not provied', async () => {
            family_body.code = ''
            family_body.company = ''

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"code\" is not allowed to be empty",
                "\"code\" length must be at least 3 characters long",
                "\"company\" is not allowed to be empty",
                "\"company\" with value \"\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/"
            ])
        })

        it('should return 200 if family is valid request', async () => {
            family_body.code = 'test update'
            
            const res = await exec()
            const body_res = _.omit(res.body, ["_id", "__v", "created_at", "update_at",
                        "routes", "control_points"])

            expect(res.status).toBe(200)
            expect(body_res).toEqual(JSON.parse(JSON.stringify(family_body)))
        })

        it('should return 400 if is body is empty', async () => {
            const exec = () => {
                return request(server)
                    .patch(`/api/families/${new_family._id}`)
                    .set('Authorization', token)
                    .send({})
            }

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"code\" is required",
                "\"company\" is required"
            ])
        })

        it('should return 400 if is unknow key is provied', async () => {
            family_body.test = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 404 if invalid url is provied', async () => {
            const exec = () => {
                return request(server)
                    .patch(`/api/familiess/${new_family._id}`)
                    .set('Authorization', token)
                    .send(family_body)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if id is not provied', async () => {
            const exec = () => {
                return request(server)
                    .patch(`/api/families`)
                    .set('Authorization', token)
                    .send(family_body)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 400 if name has large amount of characters', async () => {
            family_body.code = 'asdfasdfasdfasdfasdfasdfas'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"code\" length must be less than or equal to 25 characters long"
            ])
        })

        it('should return 400 if name has small amount of characters', async () => {
            family_body.code = 'te'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"code\" length must be at least 3 characters long"
            ])
        })

        it('should return 400 if the attribute types diferent than expected', async () => {
            family_body.code = 11

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"code\" must be a string"
              ])
        })
    })

    describe('DELETE: /api/families/:id', () => {
        
        let exec = () => {
            return request(server)
                .delete(`/api/families/${new_family._id}`)
                .set('Authorization', token)
        }

        it('should return 200 if deleted with success', async () => {
            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Delete successfully')
        })

        it('should return 400 if deleted project nonexistent', async () => {
            await exec()
            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('Invalid family')
        })

        it('should return 404 if url invalid is provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/familiess/${new_family._id}`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid id is provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/families/aa`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if id is not provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/families/`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })
    })
})