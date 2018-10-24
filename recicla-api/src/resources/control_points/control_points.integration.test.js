const request = require('supertest')
const { User } = require('../users/users.model')
const { Company } = require('../companies/companies.model')
const { ControlPoint } = require('./control_points.model')

describe('api/control_points', () => {
    let server
    let token
    let new_company
    let user
    let new_user
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

        const new_user = new User(user)
        await new_user.save()
        token = new_user.generateUserToken()
    })
    afterEach(async () => {
        await server.close()
        await User.deleteMany({})
        await Company.deleteMany({})
        await ControlPoint.deleteMany({})
    })

    describe('AUTH MIDDLEWARE', () => {
        const exec = () => {
            return request(server)
                .post('/api/control_points')
                .set('Authorization', token)
                .send({ name: 'teste 1', company: new_company._id })
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
                .post('/api/control_points')
                .set('Authorization', token)
                .send({ name: 'teste 1', company: new_company._id })
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

    describe('GET: /api/control_points', () => {
        it('should return all control points', async () => {
            await ControlPoint.collection.insertMany([
                { name: 'teste 1', company: new_company._id },
                { name: 'teste 2', company: new_company._id },
                { name: 'teste 3', company: new_company._id }
            ])

            const res = await request(server)
                .get('/api/control_points')
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
            expect(res.body.some(cp => cp.name === 'teste 1')).toBeTruthy()
            expect(res.body.some(cp => cp.name === 'teste 2')).toBeTruthy()
            expect(res.body.some(cp => cp.name === 'teste 3')).toBeTruthy()
        })
    })

    describe('GET /api/control_points/:id', () => {
        it('should return a control point if valid id is passed', async () => {
            const control_point = new ControlPoint({ name: 'teste 1', company: new_company._id })
            await control_point.save()

            const res = await request(server)
                .get(`/api/control_points/${control_point._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('name', control_point.name)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/control_points/1a`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('POST: /api/control_points', () => {
        let control_point
        const exec = () => {
            return request(server)
                .post('/api/control_points')
                .set('Authorization', token)
                .send({ name: control_point.name, company: new_company._id })
        }
        beforeEach(() => {
            control_point = { name: 'teste 1', company: new_company._id }
        })

        it('should return 400 if name is not provied', async () => {
            control_point.name = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if control_point name already exists', async () => {
            await ControlPoint.create(control_point)

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 201 if control_point is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(201)
        })

        it('should return control_point if is valid request', async () => {
            const res = await exec()

            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'name'])
            )
        })
    })

    describe('PATCH: /api/control_points/:id', () => {
        let resp
        const exec = () => {
            return request(server)
                .patch(`/api/control_points/${resp.body._id}`)
                .set('Authorization', token)
                .send({ name: 'teste edited', company: new_company._id })
        }
        beforeEach(async () => {
            resp = await request(server)
                .post('/api/control_points')
                .set('Authorization', token)
                .send({ name: 'teste 1', company: new_company._id })
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/control_points/1`)
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

    describe('DELETE: /api/control_points/:id', () => {
        let resp
        const exec = () => {
            return request(server)
                .delete(`/api/control_points/${resp.body._id}`)
                .set('Authorization', token)
        }

        it('should return 200 if deleted with success', async () => {
            resp = await request(server)
                .post('/api/control_points')
                .set('Authorization', token)
                .send({ name: 'teste 1', company: new_company._id })

            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Delete successfully')
        })
    })

})