const request = require('supertest')
const { Company } = require('../companies/companies.model')
const { User } = require('../users/users.model')
const { Family } = require('../families/families.model')
const { Route } = require('./routes.model')
const { ControlPoint } = require('../control_points/control_points.model')

describe('api/routes', () => {
    let server
    let token
    let new_company
    let new_user
    let family
    let first_point
    let second_point
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

        family = await Family.create({ code: "Family A", company: new_company._id })
        first_point = await ControlPoint.create({ name: 'teste 1', company: new_company._id })
        second_point = await ControlPoint.create({ name: 'teste 2', company: new_company._id })

    })
    afterEach(async () => {
        await server.close()
        await Company.deleteMany({})
        await User.deleteMany({})
        await Family.deleteMany({})
        await Route.deleteMany({})
        await ControlPoint.deleteMany({})
    })

    describe('GET: /api/routes', () => {
        it('should return all routes', async () => {
            const familyB = await Family.create({ code: "Family B", company: new_company._id })
            const first_pointB = await ControlPoint.create({ name: 'teste 3', company: new_company._id })
            const second_pointB = await ControlPoint.create({ name: 'teste 4', company: new_company._id })

            await Route.collection.insertMany([
                { family: family._id, first_point: first_point._id, second_point: second_point._id }, 
                { family: familyB._id, first_point: first_pointB._id, second_point: second_pointB._id }
            ])

            const res = await request(server)
                .get('/api/routes')
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
        })
    })

    describe('GET /api/routes/:id', () => {
        it('should return a control point if valid id is passed', async () => {
            const route = await Route.create({ family: family._id, first_point: first_point._id, second_point: second_point._id })

            const res = await request(server)
                .get(`/api/routes/${route._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('family._id', route.family.toString())
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/routes/1a`)
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
                .send({ family: route.family, first_point: route.first_point, second_point: route.second_point })
        }
        beforeEach(() => {
            route = { family: family._id, first_point: first_point._id, second_point: second_point._id }
        })

        it('should return 400 if family is not provied', async () => {
            route.family = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if first_point is not provied', async () => {
            route.first_point = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if second_point is not provied', async () => {
            route.second_point = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 201 if route is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(201)
        })

        it('should return route if is valid request', async () => {
            const res = await exec()

            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'family', 'first_point', 'second_point'])
            )
        })
    })

    describe('PATCH: /api/routes/:id', () => {
        let resp
        let another_family
        const exec = () => {
            return request(server)
                .patch(`/api/routes/${resp.body._id}`)
                .set('Authorization', token)
                .send({ family: another_family._id, first_point: first_point._id, second_point: second_point._id })
        }
        beforeEach(async () => {
            resp = await request(server)
                .post('/api/routes')
                .set('Authorization', token)
                .send({ family: family._id, first_point: first_point._id, second_point: second_point._id })
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/routes/1`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return control point edited if is valid request', async () => {
            another_family = await Family.create({ code: "Family Another", company: new_company._id })

            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.family).toBe(another_family._id.toString())
            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'family', 'first_point', 'second_point'])
            )
        })
    })

    describe('DELETE: /api/routes/:id', () => {
        let resp
        const exec = () => {
            return request(server)
                .delete(`/api/routes/${resp.body._id}`)
                .set('Authorization', token)
        }

        it('should return 200 if deleted with success', async () => {
            resp = await request(server)
                .post('/api/routes')
                .set('Authorization', token)
                .send({ family: family._id, first_point: first_point._id, second_point: second_point._id })

            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Delete successfully')
        })
    })
})