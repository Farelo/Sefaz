const app = require('../../../server')
const passport = require('passport')
const request = require('supertest')

beforeAll((done)=> {
    app.use((req, res, nex)=> {
        req.user = {
            id: 1
        }

        req.isAuthenticated = ()=> true

        next()
    })
    done()
})

test('GET /tags', (done)=> {
    return request(app)
        .get('/api/tags/list/pagination/2/1')
        .then(response=> {
            expect(response.status).toBe(401)
            done()
        })
        .catch(fail)
})

test('POST /tags', (done)=> {
    return request(app)
        .post('/api/tags/create')
        .send({
            code: '5040563'
        })
        .then(response=> {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.code).toBe('5040563')

            done()
        })
        .catch(fail)
})