const request = require('supertest')
const { User } = require('../users/users.model')
const { Company } = require('../companies/companies.model')
const { Type } = require('../types/types.model')
const { ControlPoint } = require('../control_points/control_points.model')
const { Department } = require('./departments.model')
const _ = require('lodash')

describe('api/departments', () => {
    let server
    let token
    let new_company
    let new_user
    let new_control_point
    let department_body
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

        new_type = await Type.create({ name: 'Factory' })

        new_control_point = await ControlPoint.create({
            lat: 2,
            lng: 2,
            name: "teste",
            duns: "teste",
            full_address: "teste teste",
            type: new_type._id,
            company: new_company._id
        })

        token = new_user.generateUserToken()
        department_body = { 
            name: 'teste 1', 
            lat: 15, 
            lng: 25, 
            control_point: new_control_point._id 
        }
    })
    afterEach(async () => {
        await server.close()
        await User.deleteMany({})
        await Company.deleteMany({})
        await Type.deleteMany({})
        await ControlPoint.deleteMany({})
        await Department.deleteMany({})
    })

    describe('AUTH MIDDLEWARE', () => {
        const exec = () => {
            return request(server)
                .post('/api/departments')
                .set('Authorization', token)
                .send(department_body)
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
                        .post('/api/departments')
                        .set('Authorization', tokenUser)
                        .send(department_body)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })        
        })

        describe('Validate authorization by GET', () => {
            it('should return 403 if user is not admin by GET', async () => {
                const exec = () => {
                    return request(server)
                        .get('/api/departments')
                        .set('Authorization', tokenUser)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })

            it('should return 403 if user is not admin by GET with id', async () => {
                const exec = () => {
                    return request(server)
                        .get(`/api/departments/${newUser._id}`)
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
                        .patch(`/api/departments/${newUser._id}`)
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
                        .delete(`/api/departments/${newUser._id}`)
                        .set('Authorization', tokenUser)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })
        })
    })

    describe('GET: /api/departments', () => {
        it('should return all departments', async () => {
            await Department.collection.insertMany([
                { name: 'teste 1', lat: 15, lng: 25, control_point: new_control_point._id },
                { name: 'teste 2', lat: 15, lng: 25, control_point: new_control_point._id },
                { name: 'teste 3', lat: 15, lng: 25, control_point: new_control_point._id }
            ])

            let saveDepartments = await Department.find({})
            .select(["-created_at", "-update_at", "-__v"]).populate("control_point", ['id', 'name', 
                    'lat', 'lng', 'duns', 'full_address', 'type', 'company'])
            saveDepartments = JSON.parse(JSON.stringify(saveDepartments))

            const res = await request(server)
                .get('/api/departments')
                .set('Authorization', token)

                expect(res.status).toBe(200)
                expect(res.body.length).toBe(3)
                const body = res.body.map((e) => _.omit(e, ["__v", "created_at", "update_at", "control_point.created_at", 
                "control_point.update_at","control_point.__v"]))
                expect(body).toEqual(saveDepartments)
        })

        it('should return 404 if invalid url is passed', async () => { 
            const res = await request(server)
                .get(`/api/departmentsss`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('GET /api/departments/:id', () => {
        let department
        beforeEach(async () => {
            department = new Department({ 
                name: 'teste 1',
                lat: 1,
                lng: 1, 
                control_point: new_control_point._id 
            })
            department.save()
        })
        it('should return a type if valid id is passed', async () => {
            const res = await request(server)
                .get(`/api/departments/${department._id}`)
                .set('Authorization', token)

            const body_res = _.omit(res.body, ["__v", "created_at", "update_at", "control_point.created_at", 
                                        "control_point.update_at","control_point.__v"])
            let body_toEqual = {
                lat: 1,
                lng: 1,
                _id: department._id,
                name: "teste 1",
                control_point: {
                    lat: 2,
                    lng: 2,
                    _id: new_control_point._id,
                    name: "teste",
                    duns: "teste",
                    full_address: "teste teste",
                    type: new_type._id,
                    company: new_company._id
                }
            }
            body_toEqual = JSON.parse(JSON.stringify(body_toEqual))
            expect(res.status).toBe(200)
            expect(body_res).toEqual(body_toEqual)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/departments/1a`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid url with valid id is passed', async () => { 
            const res = await request(server)
                .get(`/api/departmentsss/${department._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('POST: /api/departments', () => {

        const exec = () => {
            return request(server)
                .post('/api/departments')
                .set('Authorization', token)
                .send(department_body)
        }

        it('should return 400 if attributes is not provied', async () => {
            department_body.name = ''
            department_body.control_point = ''

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" is not allowed to be empty",
                "\"name\" length must be at least 5 characters long",
                "\"control_point\" is not allowed to be empty",
                "\"control_point\" with value \"\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/"
              ])
        })

        it('should return 400 if department name already exists', async () => {
            await Department.create(department_body)

            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.text).toBe("Department already exists with this name.")
        })

        it('should return 201 if type is valid request', async () => {
            const res = await exec()
            const body_res = _.omit(res.body, ["_id", "__v", "created_at", "update_at", "control_point.created_at", 
                                        "control_point.update_at","control_point.__v"])
                            
            expect(res.status).toBe(201)
            expect(body_res).toEqual(JSON.parse(JSON.stringify(department_body)))
        })

        it('should return 400 if is body is empty', async () => {
            const exec = () => {
                return request(server)
                    .post('/api/departments')
                    .set('Authorization', token)
                    .send({})
            }

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" is required", "\"control_point\" is required"
            ])
        })

        it('should return 400 if is unknow key is provied', async () => {
            department_body.test = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 404 if invalid url is provied', async () => {
            const exec = () => {
                return request(server)
                    .post('/api/departmentsss')
                    .set('Authorization', token)
                    .send(department_body)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 400 if attributes values above the limits', async () => {
            department_body.name = 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasd'
            department_body.lat = 91
            department_body.lng = 181

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" length must be less than or equal to 50 characters long",
                "\"lat\" must be less than or equal to 90",
                "\"lng\" must be less than or equal to 180"
            ])
        })

        it('should return 400 if attributes values below the limits', async () => {
            department_body.name = 'test'
            department_body.lat = -91
            department_body.lng = -181

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" length must be at least 5 characters long",
                "\"lat\" must be larger than or equal to -90",
                "\"lng\" must be larger than or equal to -180"
            ])
        })

        it('should return 400 if the attribute types diferent than expected', async () => {
            department_body.name = 11
            department_body.lat = "asd"
            department_body.lng = "asd"
            department_body.control_point = 111

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" must be a string",
                "\"lat\" must be a number",
                "\"lng\" must be a number",
                "\"control_point\" must be a string"
            ])
        })
    })

    describe('PATCH: /api/departments/:id', () => {
        let resp
        let department
        
        beforeEach(async () => {
            department = new Department(department_body)
            department.save()
        })

        const exec = () => {
            return request(server)
                .patch(`/api/departments/${department._id}`)
                .set('Authorization', token)
                .send(department_body)
        }

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .patch(`/api/departments/1`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return 400 if attributes is not provied', async () => {
            department_body.name = ''
            department_body.control_point = ''

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" is not allowed to be empty",
                "\"name\" length must be at least 5 characters long",
                "\"control_point\" is not allowed to be empty",
                "\"control_point\" with value \"\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/"
            ])
        })

        it('should return 200 if type is valid request', async () => {
            const res = await exec()
            const body_res = _.omit(res.body, ["_id", "__v", "created_at", "update_at", "control_point.created_at", 
                            "control_point.update_at","control_point.__v"])

            expect(res.status).toBe(200)
            expect(body_res).toEqual(JSON.parse(JSON.stringify(department_body)))
        })

        it('should return 400 if is body is empty', async () => {
            department_body = {}

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" is required", 
                "\"control_point\" is required"
            ])
        })

        it('should return 400 if is unknow key is provied', async () => {
            department_body.test = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 404 if invalid url is provied', async () => {
            const exec = () => {
                return request(server)
                    .patch(`/api/departmentsss/${department._id}`)
                    .set('Authorization', token)
                    .send(department_body)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 400 if attributes values above the limits', async () => {
            department_body.name = 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasd'
            department_body.lat = 91
            department_body.lng = 181

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" length must be less than or equal to 50 characters long",
                "\"lat\" must be less than or equal to 90",
                "\"lng\" must be less than or equal to 180"
            ])
        })

        it('should return 400 if attributes values below the limits', async () => {
            department_body.name = 'test'
            department_body.lat = -91
            department_body.lng = -181

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" length must be at least 5 characters long",
                "\"lat\" must be larger than or equal to -90",
                "\"lng\" must be larger than or equal to -180"
            ])
        })

        it('should return 400 if the attribute types diferent than expected', async () => {
            department_body.name = 11
            department_body.lat = "asd"
            department_body.lng = "asd"
            department_body.control_point = 111

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"name\" must be a string",
                "\"lat\" must be a number",
                "\"lng\" must be a number",
                "\"control_point\" must be a string"
            ])
        })
    })

    describe('DELETE: /api/departments/:id', () => {
        let resp
        let exec
        
        beforeEach(async () => {
            resp = await request(server)
                .post('/api/departments')
                .set('Authorization', token)
                .send(department_body)

            exec = () => {
                return request(server)
                    .delete(`/api/departments/${resp.body._id}`)
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
                    .delete(`/api/departmentsss/${resp.body._id}`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid id is provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/departments/aa`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if id is not provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/departments/`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 400 if deleted type nonexistent', async () => {
            await exec()
            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('Invalid department')
        })
    })
})
