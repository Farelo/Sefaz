const request = require('supertest')
const { User } = require('../users/users.model')
const { Company } = require('../companies/companies.model')
const { ControlPoint } = require('../control_points/control_points.model')
const { Department } = require('./departments.model')

describe('api/control_points', () => {
    let server
    let token
    let new_company
    let new_user
    let new_control_point
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
        
        new_control_point = new ControlPoint({ name: 'teste', company: new_company._id })
        await new_control_point.save()

        token = new_user.generateUserToken()
    })
    afterEach(async () => {
        await server.close()
        await User.deleteMany({})
        await Company.deleteMany({})
        await ControlPoint.deleteMany({})
        await Department.deleteMany({})
    })

    describe('AUTH MIDDLEWARE', () => {
        const exec = () => {
            return request(server)
                .post('/api/departments')
                .set('Authorization', token)
                .send({ name: 'teste', control_point: new_control_point._id })
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

        it('should return 201 if token is valid', async () => {
            const res = await exec()
            expect(res.status).toBe(201)
        })
    })

    describe('AUTHZ MIDDLEWARE', () => {
        const exec = () => {
            return request(server)
                .post('/api/departments')
                .set('Authorization', token)
                .send({ name: 'teste 1', control_point: new_control_point._id })
        }
        it('should return 403 if user is not admin', async () => {
            user = {
                full_name: 'Teste Man',
                email: "serginho@gmail.com",
                password: "qwerty123",
                role: 'user',
                company: {
                    _id: new_company._id,
                    name: new_company.name
                }
            }

            const new_user = new User(user)
            token = new_user.generateUserToken()

            const res = await exec()
            expect(res.status).toBe(403)
        })

        it('should return 201 if user is admin', async () => {
            const res = await exec()
            expect(res.status).toBe(201)
        })
    })

    describe('GET: /api/departments', () => {
        it('should return all control points', async () => {
            await Department.collection.insertMany([
                { name: 'teste 1', lat: 15, lng: 25, control_point: new_control_point._id },
                { name: 'teste 2', lat: 15, lng: 25, control_point: new_control_point._id },
                { name: 'teste 3', lat: 15, lng: 25, control_point: new_control_point._id }
            ])

            const res = await request(server)
                .get('/api/departments')
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
            expect(res.body.some(dp => dp.name === 'teste 1')).toBeTruthy()
            expect(res.body.some(dp => dp.name === 'teste 2')).toBeTruthy()
            expect(res.body.some(dp => dp.name === 'teste 3')).toBeTruthy()
        })
    })

    describe('GET /api/departments/:id', () => {
        it('should return a department if valid id is passed', async () => {
            const department = new Department({ name: 'teste 1', control_point: new_control_point._id })
            await department.save()

            const res = await request(server)
                .get(`/api/departments/${department._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('name', department.name)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/departments/1a`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('POST: /api/departments', () => {
        let department
        const exec = () => {
            return request(server)
                .post('/api/departments')
                .set('Authorization', token)
                .send({ name: department.name, control_point: department.control_point })
        }
        beforeEach(() => {
            department = { name: 'teste 1', control_point: new_control_point._id }
        })

        it('should return 400 if name is not provied', async () => {
            department.name = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if control_point is not provied', async () => {
            department.control_point = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if department name already exists', async () => {
            await Department.create(department)

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 201 if department is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(201)
        })

        it('should return department if is valid request', async () => {
            const res = await exec()

            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'name'])
            )
        })
    })

    describe('PATCH: /api/departments/:id', () => {
        let resp
        const exec = () => {
            return request(server)
                .patch(`/api/departments/${resp.body._id}`)
                .set('Authorization', token)
                .send({ name: 'teste edited', control_point: new_control_point._id })
        }
        beforeEach(async () => {
            resp = await request(server)
                .post('/api/departments')
                .set('Authorization', token)
                .send({ name: 'teste 1', control_point: new_control_point._id})
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/departments/1`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return control point edited if is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.name).toBe('teste edited')
            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'name'])
            )
        })
    })

    describe('DELETE: /api/departments/:id', () => {
        let resp
        const exec = () => {
            return request(server)
                .delete(`/api/departments/${resp.body._id}`)
                .set('Authorization', token)
        }

        it('should return 200 if deleted with success', async () => {
            resp = await request(server)
                .post('/api/departments')
                .set('Authorization', token)
                .send({ name: 'teste 1', control_point: new_control_point._id })

            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Delete successfully')
        })
    })
})
