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
    let new_type
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

        new_type = new Type(type_body)
        new_type.save() 
    })
    afterEach(async () => {
        await server.close()
        await User.deleteMany({})
        await Company.deleteMany({})
        await Type.deleteMany({})
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
            expect(res.body.length).toBe(4)
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
            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body.message).toBe("Type already exists with this name.")
        })

        it('should return 201 if type is valid request', async () => {
            type_body.name = 'create test'
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
        
        const exec = () => {
            return request(server)
                .patch(`/api/types/${new_type._id}`)
                .set('Authorization', token)
                .send(type_body)
        }
        
        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .patch(`/api/types/1`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return 400 if name is not provied', async () => {
            type_body.name = ''

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" is not allowed to be empty",
                "\"name\" length must be at least 5 characters long"
            ])
        })

        it('should return 200 if type is valid request', async () => {
            const res = await exec()
            const body_res = _.omit(res.body, ["_id", "__v", "created_at", "update_at"])

            expect(res.status).toBe(200)
            expect(body_res).toEqual(JSON.parse(JSON.stringify({name: type_body.name})))
        })

        it('should return 400 if is body is empty', async () => {
            type_body = {}

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
                    .patch('/api/typess')
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

    describe('DELETE: /api/types/:id', () => {
        
        exec = () => {
            return request(server)
                .delete(`/api/types/${new_type._id}`)
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
            expect(res.body.message).toBe('Invalid type')
        })

        it('should return 404 if url invalid is provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/typess/${new_type._id}`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid id is provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/types/aa`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if id is not provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/types/`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })
    })

})