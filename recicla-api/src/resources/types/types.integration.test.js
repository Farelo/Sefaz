const request = require('supertest')
const mongoose = require('mongoose')
const { User } = require('../users/users.model')
const { Company } = require('../companies/companies.model')
const { Type } = require('./types.model')
const _ = require('lodash')

describe('api/types', () => {
    let server
    let token
    let new_company
    let new_user
    let type_body
    beforeEach(async () => {
        server = require('../../server')

        new_company = await Company.create({ name: 'CEBRACE TESTE' })

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

        token = new_user.generateUserToken()
        type_body = { name: 'TESTE' }
    })
    afterEach(async () => {
        await server.close()
        await User.deleteMany({})
        await Company.deleteMany({})
        await Type.deleteMany({})
    })

    describe('AUTH MIDDLEWARE', () => {
        const exec = () => {
            return request(server)
                .post('/api/types')
                .set('Authorization', token)
                .send(type_body)
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
                        .post('/api/types')
                        .set('Authorization', tokenUser)
                        .send(type_body)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })        
        })

        describe('Validate authorization by GET', () => {
            it('should return 403 if user is not admin by GET', async () => {
                const exec = () => {
                    return request(server)
                        .get('/api/types')
                        .set('Authorization', tokenUser)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })

            it('should return 403 if user is not admin by GET with id', async () => {
                const exec = () => {
                    return request(server)
                        .get(`/api/types/${newUser._id}`)
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
                        .patch(`/api/types/${newUser._id}`)
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
                        .delete(`/api/types/${newUser._id}`)
                        .set('Authorization', tokenUser)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })
        })
    })

    describe('GET: /api/types', () => {
        it('should return all types', async () => {
            await Type.collection.insertMany([
                { name: 'teste 1' },
                { name: 'teste 2' },
                { name: 'teste 3' }
            ])

            let saveTypes = await Type.find({})
            .select(["-created_at", "-update_at", "-__v"])
            saveTypes = JSON.parse(JSON.stringify(saveTypes))

            const res = await request(server)
                .get('/api/types')
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
            const body = res.body.map((e) => _.omit(e, ["__v", "created_at", "update_at"]))
            expect(body).toEqual(saveTypes)
        })

        it('should return 404 if invalid url is passed', async () => { 
            const res = await request(server)
                .get(`/api/typessss`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('GET /api/types/:id', () => {
        let type
        beforeEach(async () => {
            type = new Type({ name: 'teste 1' })
            type.save()
        })
        it('should return a type if valid id is passed', async () => {
            const res = await request(server)
                .get(`/api/types/${type._id}`)
                .set('Authorization', token)

            const body_res = _.omit(res.body, ["__v", "created_at", "update_at"])
            let body_toEqual = {
                _id: type._id,
                name: 'teste 1'
            }
            body_toEqual = JSON.parse(JSON.stringify(body_toEqual))
            expect(res.status).toBe(200)
            expect(body_res).toEqual(body_toEqual)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/types/1a`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid url with valid id is passed', async () => { 
            const res = await request(server)
                .get(`/api/typess/${type._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('POST: /api/types', () => {
        const exec = () => {
            return request(server)
                .post('/api/types')
                .set('Authorization', token)
                .send(type_body)
        }

        it('should return 400 if name is not provied', async () => {
            type_body.name = ''

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" is not allowed to be empty",
                "\"name\" length must be at least 5 characters long"
              ])
        })

        it('should return 400 if type name already exists', async () => {
            await Type.create(type_body)

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body.message).toBe("Type already exists with this name.")
        })

        it('should return 201 if type is valid request', async () => {
            const res = await exec()
            const body_res = _.omit(res.body, ["_id", "__v", "created_at", "update_at"])

            expect(res.status).toBe(201)
            expect(body_res).toEqual(JSON.parse(JSON.stringify({name: type_body.name})))
        })

        it('should return 400 if is body is empty', async () => {
            const exec = () => {
                return request(server)
                    .post('/api/types')
                    .set('Authorization', token)
                    .send({})
            }

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" is required"
            ])
        })

        it('should return 400 if is unknow key is provied', async () => {
            type_body.test = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 404 if invalid url is provied', async () => {
            const exec = () => {
                return request(server)
                    .post('/api/typess')
                    .set('Authorization', token)
                    .send(type_body)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 400 if name has large amount of characters', async () => {
            type_body.name = 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasd'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" length must be less than or equal to 50 characters long"
            ])
        })

        it('should return 400 if name has small amount of characters', async () => {
            type_body.name = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" length must be at least 5 characters long"
            ])
        })

        it('should return 400 if the attribute types diferent than expected', async () => {
            type_body.name = 11

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" must be a string"
              ])
        })
    })

    describe('PATCH: /api/types/:id', () => {
        let resp
        const exec = () => {
            return request(server)
                .patch(`/api/types/${resp.body._id}`)
                .set('Authorization', token)
                .send({ name: 'teste edited' })
        }
        beforeEach(async () => {
            resp = await request(server)
                .post('/api/types')
                .set('Authorization', token)
                .send(type_body)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/types/1`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return type edited if is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.name).toBe('teste edited')
            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'name'])
            )
        })
    })

    describe('DELETE: /api/types/:id', () => {
        let resp
        const exec = () => {
            return request(server)
                .delete(`/api/types/${resp.body._id}`)
                .set('Authorization', token)
        }

        it('should return 200 if deleted with success', async () => {
            resp = await request(server)
                .post('/api/types')
                .set('Authorization', token)
                .send(type_body)

            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Delete successfully')
        })
    })

})