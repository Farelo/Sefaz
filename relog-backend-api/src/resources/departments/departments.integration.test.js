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
    let new_department
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
            full_address: "teste teste",
            type: new_type._id,
            company: new_company._id
        })

        token = new_user.generateUserToken()
        department_body = { 
            name: 'teste 100', 
            lat: 15, 
            lng: 25, 
            control_point: new_control_point._id 
        }

        new_department = new Department(department_body)
        new_department.save()
    })
    afterEach(async () => {
        await server.close()
        await User.deleteMany({})
        await Company.deleteMany({})
        await Type.deleteMany({})
        await ControlPoint.deleteMany({})
        await Department.deleteMany({})
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
        it('should return a department if valid id is passed', async () => {
            const res = await request(server)
                .get(`/api/departments/${department._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
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
    
            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.text).toBe("Department already exists with this name.")
        })

        it('should return 201 if type is valid request', async () => {
            department_body.name = 'department create test'
            
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
        
        const exec = () => {
            return request(server)
                .patch(`/api/departments/${new_department._id}`)
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
                    .patch(`/api/departmentsss/${new_department._id}`)
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
        let exec = () => {
            return request(server)
                .delete(`/api/departments/${new_department._id}`)
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
            expect(res.body.message).toBe('Invalid department')
        })

        it('should return 404 if url invalid is provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/departmentsss/${new_department._id}`)
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
    })
})
