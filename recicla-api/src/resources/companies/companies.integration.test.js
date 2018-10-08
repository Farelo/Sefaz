const request = require('supertest')
const { Company } = require('./companies.model')

describe('api/companies', () => {
    let server
    beforeEach(() => server = require('../../server'))
    afterEach(async () => {
        await server.close()
        await Company.deleteMany({})
    })

    describe('GET: /api/companies', () => {
        it('should return all companies', async () => {
            await Company.collection.insertMany([{ name: "Company 1" }, { name: "Company 2" }])

            const res = await request(server).get('/api/companies')

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(res.body.some(c => c.name === 'Company 1')).toBeTruthy()
            expect(res.body.some(c => c.name === 'Company 2')).toBeTruthy()
        })
    })

    describe('GET /companies/:id', () => {
        it('should return a company if valid id is passed', async () => {
            const company = new Company({ name: 'Company 1' })
            await company.save()

            const res = await request(server).get(`/api/companies/${company._id}`)
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('name', company.name)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get(`/api/companies/1a`)
            expect(res.status).toBe(404)
        })
    })

    describe('POST: /api/companies', () => {
        let company
        const exec = () => {
            return request(server)
                .post('/api/companies')
                .send({ name: company.name })
        }
        beforeEach(() => {
            company = { name: "Sergio Junior", }
        })

        it('should return 400 if name is not provied', async () => {
            company.name = ''
            
            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 200 if company is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(200)
        })

        it('should return company if is valid request', async () => {
            const res = await exec()

            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'name'])
            )
        })
    })

    describe('PATCH: /api/companies/:id', () => {
        let resp
        const exec = () => {
            return request(server)
                .patch(`/api/companies/${resp.body._id}`)
                .send({ name: 'TesteName edited' })
        }
        beforeEach(async () => {
            resp = await request(server)
                .post('/api/companies')
                .send({ name: 'company.name' })
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get(`/api/companies/1`)
            expect(res.status).toBe(404)
        })

        it('should return company edited if is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.name).toBe('TesteName edited')
            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'name'])
            )
        })
    })

    describe('DELETE: /api/companies/:id', () => {
        let resp
        const exec = () => {
            return request(server).delete(`/api/companies/${resp.body._id}`)
        }

        it('should return 200 if deleted with success', async () => {
            resp = await request(server)
                .post('/api/companies')
                .send({ name: 'company.name' })

            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Delete successfully')
        })
    })

})