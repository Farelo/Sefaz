const request = require('supertest')
const { User } = require('../users/users.model')
const { Company } = require('../companies/companies.model')
const { Family } = require('../families/families.model')
const { Rack } = require('./racks.model')
const _ = require('lodash')

describe('api/racks', () => {
    let server
    let token
    let new_company
    let new_user
    let new_family
    let rack_body
    let new_rack
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

        rack_body = {
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
            fabrication_date: "2019-05-17",
            observations: "teste",
            active: true,
            family: new_family._id
        }

        new_rack = new Rack(rack_body)
        new_rack.save()
    })
    afterEach(async () => {
        await server.close()
        await User.deleteMany({})
        await Company.deleteMany({})
        await Family.deleteMany({})
        await Rack.deleteMany({})
    })

    describe('GET: /api/racks', () => {

        it('should return all racks', async () => {
            await Rack.insertMany([
                {
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
                },
                {
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
            ])

            const res = await request(server)
                .get('/api/racks')
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
        })

        it('should return 404 if invalid url is passed', async () => { 
            const res = await request(server)
                .get(`/api/racksss`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('GET /api/racks/:id', () => {
        it('should return a rack if valid id is passed', async () => {
            const res = await request(server)
                .get(`/api/racks/${new_rack._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/racks/1a`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid url with valid id is passed', async () => { 
            const res = await request(server)
                .get(`/api/racksss/${new_rack._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('POST: /api/racks', () => {
        
        const exec = () => {
            return request(server)
                .post('/api/racks')
                .set('Authorization', token)
                .send(rack_body)
        }

        beforeEach(async () => {
            rack_body = {
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
                fabrication_date: "2019-05-17",
                observations: "teste",
                active: true,
                family: new_family._id
            }
        })

        it('should return 400 if requeired attributes is not provied', async () => {
            rack_body.tag.code = ''
            rack_body.serial = ''

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"code\" is not allowed to be empty",
                "\"code\" length must be at least 4 characters long",
                "\"serial\" is not allowed to be empty",
                "\"serial\" length must be at least 2 characters long"
            ])
        })

        it('should return 400 if is body is empty', async () => {
            const exec = () => {
                return request(server)
                    .post('/api/racks')
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
            rack_body.test = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 404 if invalid url is provied', async () => {
            const exec = () => {
                return request(server)
                    .post('/api/rackssss')
                    .set('Authorization', token)
                    .send(rack_body)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 400 if attributes values above the limits', async () => {
            rack_body.tag.code = 'asdfasdfasdfasdfasdfasdfas'
            rack_body.tag.version = 'asdfasdfasdfasdfasdfasdfasasdfa'
            rack_body.tag.manufactorer = 'asdfasdfasdfasdfasdfasdfasasdfa'
            rack_body.serial = 'asdfasdfasdfasdfasdfasdfasasdfa'
            rack_body.weigth = 10001
            rack_body.width = 10001
            rack_body.heigth = 10001
            rack_body.length = 10001
            rack_body.capacity = 10001
            rack_body.observations = 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfaa'

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

        it('should return 400 if id attributes are invalid', async () => {
            rack_body.family = "asd"

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"family\" with value \"asd\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/"
            ])
        })

        it('should return 400 if the attribute types diferent than expected', async () => {
            rack_body.tag.code = 11
            rack_body.tag.version = 11
            rack_body.tag.manufactorer = 11
            rack_body.serial = 11
            rack_body.weigth = 'asd'
            rack_body.width = 'asd'
            rack_body.length = 'asd'
            rack_body.heigth = 'asd'
            rack_body.capacity = 'asd'
            rack_body.observations = 11
            rack_body.active = 11
            rack_body.family = 11

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

    describe('PATCH: /api/racks/:id', () => {
        
        const exec = () => {
            return request(server)
                .patch(`/api/racks/${new_rack._id}`)
                .set('Authorization', token)
                .send(rack_body)
        }

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .patch(`/api/racks/1`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return 400 if required attributes is not provied', async () => {
            rack_body.tag.code = ''
            rack_body.serial = ''

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
            const res = await exec()

            expect(res.status).toBe(200)
        })

        it('should return 400 if is body is empty', async () => {
            const exec = () => {
                return request(server)
                    .patch(`/api/racks/${new_rack._id}`)
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
            rack_body.test = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 404 if invalid url is provied', async () => {
            const exec = () => {
                return request(server)
                    .post('/api/rackssss')
                    .set('Authorization', token)
                    .send(rack_body)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 400 if attributes values above the limits', async () => {
            rack_body.tag.code = 'asdfasdfasdfasdfasdfasdfas'
            rack_body.tag.version = 'asdfasdfasdfasdfasdfasdfasasdfa'
            rack_body.tag.manufactorer = 'asdfasdfasdfasdfasdfasdfasasdfa'
            rack_body.serial = 'asdfasdfasdfasdfasdfasdfasasdfa'
            rack_body.weigth = 10001
            rack_body.width = 10001
            rack_body.heigth = 10001
            rack_body.length = 10001
            rack_body.capacity = 10001
            rack_body.observations = 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfaa'

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

        it('should return 400 if id attributes are invalid', async () => {
            rack_body.family = "asd"

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"family\" with value \"asd\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/"
            ])
        })

        it('should return 400 if the attribute types diferent than expected', async () => {
            rack_body.tag.code = 11
            rack_body.tag.version = 11
            rack_body.tag.manufactorer = 11
            rack_body.serial = 11
            rack_body.weigth = 'asd'
            rack_body.width = 'asd'
            rack_body.length = 'asd'
            rack_body.heigth = 'asd'
            rack_body.capacity = 'asd'
            rack_body.observations = 11
            rack_body.active = 11
            rack_body.family = 11

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

    describe('DELETE: /api/racks/:id', () => {

        let exec = () => {
            return request(server)
                .delete(`/api/racks/${new_rack._id}`)
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
            expect(res.body.message).toBe('Invalid rack')
        })

        it('should return 404 if url invalid is provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/racksss/${new_rack._id}`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid id is provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/racks/aa`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if id is not provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/racks/`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })
    })

})