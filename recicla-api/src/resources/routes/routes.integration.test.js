const request = require('supertest')
const { Company } = require('../companies/companies.model')
const { User } = require('../users/users.model')
const { Family } = require('../families/families.model')
const { Route } = require('./routes.model')
const { Type } = require('../types/types.model')
const { ControlPoint } = require('../control_points/control_points.model')
const _ = require('lodash')

describe('api/routes', () => {
    let server
    let token
    let new_company
    let new_user
    let family
    let new_type
    let first_point
    let second_point
    let route_body
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
        
        new_type = await Type.create({ name: 'Factory' })
        
        family = await Family.create({ code: "Family A", company: new_company._id })
        first_point = await ControlPoint.create({
            lat: 2,
            lng: 2,
            name: "teste 1",
            duns: "teste",
            full_address: "teste teste",
            type: new_type._id,
            company: new_company._id
        })
        second_point = await ControlPoint.create({
            lat: 2,
            lng: 2,
            name: "teste 2",
            duns: "teste",
            full_address: "teste teste",
            type: new_type._id,
            company: new_company._id
        })
        token = new_user.generateUserToken()
        route_body = {
            family: family._id,
            first_point: first_point._id,
            second_point: second_point._id,
            distance: 100,
            duration_time: 1000,
            traveling_time: {
              max: 100,
              min: 50
            }
        }
    })
    afterEach(async () => {
        await server.close()
        await Company.deleteMany({})
        await User.deleteMany({})
        await Family.deleteMany({})
        await Route.deleteMany({})
        await Type.deleteMany({})
        await ControlPoint.deleteMany({})
    })

    describe('AUTH MIDDLEWARE', () => {
        const exec = () => {
            return request(server)
                .post('/api/routes')
                .set('Authorization', token)
                .send(route_body)
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
                        .post('/api/routes')
                        .set('Authorization', tokenUser)
                        .send(route_body)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })        
        })

        describe('Validate authorization by GET', () => {
            it('should return 403 if user is not admin by GET', async () => {
                const exec = () => {
                    return request(server)
                        .get('/api/routes')
                        .set('Authorization', tokenUser)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })

            it('should return 403 if user is not admin by GET with id', async () => {
                const exec = () => {
                    return request(server)
                        .get(`/api/routes/${newUser._id}`)
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
                        .patch(`/api/routes/${newUser._id}`)
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
                        .delete(`/api/routes/${newUser._id}`)
                        .set('Authorization', tokenUser)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })
        })
    })

    describe('GET: /api/routes', () => {
        it('should return all routes', async () => {
             const routes = [
                {
                    family: family._id,
                    first_point: first_point._id,
                    second_point: second_point._id,
                    distance: 101,
                    duration_time: 1000,
                    traveling_time: {
                        max: 102,
                        min: 50
                    }
                },     
                {
                    family: family._id,
                    first_point: first_point._id,
                    second_point: second_point._id,
                    distance: 101,
                    duration_time: 1000,
                    traveling_time: {
                        max: 102,
                        min: 50
                    }     
            }];
            
            await Route.collection.insertMany(routes)

            let saveRoutes = await Route.find({})
            .select(["-created_at", "-update_at", "-__v", "-traveling_time.overtime"])
                .populate("family", ["_id", "code"])
                .populate("first_point", ["_id", "name", "type"])
                .populate("second_point", ["_id", "name", "type"])
    
            saveRoutes = JSON.parse(JSON.stringify(saveRoutes))

            const res = await request(server)
                .get('/api/routes')
                .set('Authorization', token)

            body_res = res.body.map((e) => _.omit(e, ["__v", "created_at", "update_at", "traveling_time.overtime"]))    

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(body_res).toEqual(saveRoutes)
        })

        it('should return 404 if invalid url is passed', async () => { 
            const res = await request(server)
                .get(`/api/routess`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('GET /api/routes/:id', () => {
        let route
        beforeEach(async () => {
            route = new Route(route_body)
            route.save()
        })
        
        it('should return 200 if valid id is passed', async () => {
        
            const res = await request(server)
                .get(`/api/routes/${route._id}`)
                .set('Authorization', token)

            const body_res = _.omit(res.body, ["__v", "created_at", "update_at", "traveling_time.overtime"])    
            const body_toEqual = {
                _id: route._id,
                family: {
                    _id: family._id,
                    code: family.code
                },
                first_point: {
                    _id: first_point._id,
                    name: first_point.name,
                    type: first_point.type
                },
                second_point: {
                    _id: second_point._id,
                    name: second_point.name,
                    type: second_point.type
                },
                distance: 100,
                duration_time: 1000,
                traveling_time: {
                    max: 100,
                    min: 50
                }
            }
            expect(res.status).toBe(200)
            expect(body_res).toEqual(JSON.parse(JSON.stringify(body_toEqual)))
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/routes/1a`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid url with valid id is passed', async () => { 
            const res = await request(server)
                .get(`/api/routess/${route._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('POST: /api/routes', () => {
        let route
        const exec = () => {
            return request(server)
                .post('/api/routes')
                .set('Authorization', token)
                .send(route_body)
        }
        
        it('should return 400 if requeired attributes is not provied', async () => {
            route_body.family = ''
            route_body.first_point = ''
            route_body.second_point = ''

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"first_point\" is not allowed to be empty", 
                "\"first_point\" with value \"\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/", 
                "\"second_point\" is not allowed to be empty", 
                "\"second_point\" with value \"\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/", 
                "\"family\" is not allowed to be empty", 
                "\"family\" with value \"\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/"
            ])
        })

        it('should return 201 if route is valid request', async () => {
            const res = await exec()
            const body_res = _.omit(res.body, ["_id", "__v", "created_at", "update_at", "traveling_time.overtime"])
                            
            expect(res.status).toBe(201)
            expect(body_res).toEqual(JSON.parse(JSON.stringify(route_body)))
        })

        it('should return 400 if is body is empty', async () => {
            const exec = () => {
                return request(server)
                    .post('/api/routes')
                    .set('Authorization', token)
                    .send({})
            }

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"first_point\" is required", 
                "\"second_point\" is required", 
                "\"family\" is required"
            ])
        })

        it('should return 400 if is unknow key is provied', async () => {
           route_body.test = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 404 if invalid url is provied', async () => {
            const exec = () => {
                return request(server)
                    .post('/api/routesss')
                    .set('Authorization', token)
                    .send(route_body)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 400 if the attribute types diferent than expected', async () => {
            route_body.first_point = 11
            route_body.second_point = 11
            route_body.family = 11
            route_body.distance = "asd"
            route_body.duration_time = "asd"
            route_body.traveling_time.max = "asd"
            route_body.traveling_time.min = "asd"

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"first_point\" must be a string",
                "\"second_point\" must be a string",
                "\"family\" must be a string",
                "\"distance\" must be a number",
                "\"duration_time\" must be a number",
                "\"max\" must be a number",
                "\"min\" must be a number"
            ])
        })

        it('should return 400 if id attributes are invalid', async () => {
            route_body.first_point = "as"
            route_body.second_point = "asd"
            route_body.family = "asd"

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"first_point\" with value \"as\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/",
                "\"second_point\" with value \"asd\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/",
                "\"family\" with value \"asd\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/"
            ])
        })
    })

    describe('PATCH: /api/routes/:id', () => {
        let route
        const exec = () => {
            return request(server)
                .patch(`/api/routes/${route._id}`)
                .set('Authorization', token)
                .send(route_body)
        }
        beforeEach(async () => {
            route = new Route(route_body)
            route.save()
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/routes/1`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return 400 if attributes is not provied', async () => {
            route_body.family = ''
            route_body.first_point = ''
            route_body.second_point = ''

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"first_point\" is not allowed to be empty", 
                "\"first_point\" with value \"\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/", 
                "\"second_point\" is not allowed to be empty", 
                "\"second_point\" with value \"\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/", 
                "\"family\" is not allowed to be empty", 
                "\"family\" with value \"\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/"
            ])
        })

        it('should return 200 if route is valid request', async () => {
            route_body.distance = 100
            route_body.duration_time = 100
            route_body.traveling_time.max = 100
            route_body.traveling_time.min = 10

            const res = await exec()
            const body_res = _.omit(res.body, ["_id", "__v", "created_at", "update_at", "traveling_time.overtime"])

            expect(res.status).toBe(200)
            expect(body_res).toEqual(JSON.parse(JSON.stringify(route_body)))
        })

        it('should return 400 if is body is empty', async () => {
            route_body = {}

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"first_point\" is required", 
                "\"second_point\" is required", 
                "\"family\" is required"
            ])
        })

        it('should return 400 if is unknow key is provied', async () => {
            route_body.test = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 404 if invalid url is provied', async () => {
            const exec = () => {
                return request(server)
                    .post(`/api/routess/${route._id}`)
                    .set('Authorization', token)
                    .send(route_body)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 400 if the attribute types diferent than expected', async () => {
            route_body.first_point = 11
            route_body.second_point = 11
            route_body.family = 11
            route_body.distance = "asd"
            route_body.duration_time = "asd"
            route_body.traveling_time.max = "asd"
            route_body.traveling_time.min = "asd"

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"first_point\" must be a string",
                "\"second_point\" must be a string",
                "\"family\" must be a string",
                "\"distance\" must be a number",
                "\"duration_time\" must be a number",
                "\"max\" must be a number",
                "\"min\" must be a number"
            ])
        })

        it('should return 400 if id attributes are invalid', async () => {
            route_body.first_point = "as"
            route_body.second_point = "asd"
            route_body.family = "asd"

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"first_point\" with value \"as\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/",
                "\"second_point\" with value \"asd\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/",
                "\"family\" with value \"asd\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/"
            ])
        })
    })

    describe('DELETE: /api/routes/:id', () => {
        let resp
        let exec
        
        beforeEach(async () => {
            resp = await request(server)
                .post('/api/routes')
                .set('Authorization', token)
                .send(route_body)

            exec = () => {
                return request(server)
                    .delete(`/api/routes/${resp.body._id}`)
                    .set('Authorization', token)
            }    
        })

        it('should return 200 if deleted with success', async () => {
            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Delete successfully')
        })

        it('should return 404 if url invalid is provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/routesss/${resp.body._id}`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid id is provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/routes/aa`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if id is not provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/routes/`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 400 if deleted type nonexistent', async () => {
            await exec()
            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('Invalid route')
        })
    })
})