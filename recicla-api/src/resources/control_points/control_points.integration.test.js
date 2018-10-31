const request = require('supertest')
const mongoose = require('mongoose')
const { User } = require('../users/users.model')
const { Company } = require('../companies/companies.model')
const { Type } = require('../types/types.model')
const { ControlPoint } = require('./control_points.model')

describe('api/control_points', () => {
    let server
    let token
    let new_company
    let new_user
    let new_type
    let control_point_body
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
        new_type = await Type.create({name: 'Factory'})

        token = new_user.generateUserToken()
        control_point_body = { name: 'teste 1', type: new_type._id, company: new_company._id }
    })
    afterEach(async () => {
        await server.close()
        await Company.deleteMany({})
        await User.deleteMany({})
        await Type.deleteMany({})
        await ControlPoint.deleteMany({})
    })

    describe('AUTH MIDDLEWARE', () => {
        const exec = () => {
            return request(server)
                .post('/api/control_points')
                .set('Authorization', token)
                .send(control_point_body)
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
                .send(control_point_body)
        }
        it('should return 403 if user is not admin', async () => {
            const another_user = await User.create({
                full_name: 'Teste Man',
                email: "serginho1@gmail.com",
                password: "qwerty123",
                role: 'user',
                company: {
                    _id: new_company._id,
                    name: new_company.name
                }
            })

            token = another_user.generateUserToken()

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
                { name: 'teste 1', type: new_type._id, company: new_company._id },
                { name: 'teste 2', type: new_type._id, company: new_company._id },
                { name: 'teste 3', type: new_type._id, company: new_company._id }
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
            const control_point = await ControlPoint.create(control_point_body)

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
        const exec = () => {
            return request(server)
                .post('/api/control_points')
                .set('Authorization', token)
                .send({ name: control_point_body.name, type: control_point_body.type, company: control_point_body.company })
        }

        it('should return 400 if name is not provied', async () => {
            control_point_body.name = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if type is not provied', async () => {
            control_point_body.type = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if company is not provied', async () => {
            control_point_body.company = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if control_point name already exists', async () => {
            await ControlPoint.create(control_point_body)

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 404 if invalid company id is passed', async () => {
            control_point_body.company = mongoose.Types.ObjectId()

            const res = await exec()

            expect(res.status).toBe(404)
            expect(res.body.message).toBe('Invalid company.')
        })

        it('should return 404 if invalid type id is passed', async () => {
            control_point_body.type = mongoose.Types.ObjectId()

            const res = await exec()

            expect(res.status).toBe(404)
            expect(res.body.message).toBe('Invalid type.')
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
                .send({ name: 'teste edited', type: control_point_body.type, company: control_point_body.company })
        }
        beforeEach(async () => {
            resp = await request(server)
                .post('/api/control_points')
                .set('Authorization', token)
                .send(control_point_body)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/control_points/1`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid company id is passed', async () => {
            control_point_body.company = mongoose.Types.ObjectId()

            const res = await exec()

            expect(res.status).toBe(404)
            expect(res.body.message).toBe('Invalid company.')
        })

        it('should return 404 if invalid type id is passed', async () => {
            control_point_body.type = mongoose.Types.ObjectId()

            const res = await exec()

            expect(res.status).toBe(404)
            expect(res.body.message).toBe('Invalid type.')
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
                .send(control_point_body)

            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Delete successfully')
        })
    })

})