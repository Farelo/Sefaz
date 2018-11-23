const request = require('supertest')
const mongoose = require('mongoose')
const { User } = require('../users/users.model')
const { Company } = require('../companies/companies.model')
const { Family } = require('../families/families.model')
const { Packing } = require('./packings.model')

describe('api/packings', () => {
    let server
    let token
    let new_company
    let new_user
    let new_family
    let packing_body
    let new_packing
    beforeEach(async () => {
        server = require('../../server')

        new_company = new Company({ name: 'CEBRACE TESTE' })
        await new_company.save()
        const user = {
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

        packing_body = { tag: {code: 'CODE'}, serial: 'SERIAL', family: new_family._id }

        new_packing = new Packing(packing_body)
        new_packing.save()
    })
    afterEach(async () => {
        await server.close()
        await User.deleteMany({})
        await Company.deleteMany({})
        await Family.deleteMany({})
        await Packing.deleteMany({})
    })

    describe('AUTH MIDDLEWARE', () => {
        jest.setTimeout(30000)
        
        describe('Validate token by GET method without id', () => {
            const exec = () => {
                return request(server)
                    .get('/api/packings')
                    .set('Authorization', token)
            }

            it('should return 401 if no token is provided', async () => {
                token = ''
                const res = await exec()
                expect(res.status).toBe(401)
                expect(res.body.message).toBe('Access denied. No token provided.')
            })

            it('should return 400 if token is invalid', async () => {
                token = 'a'
                const res = await exec()
                expect(res.status).toBe(400)
                expect(res.body.message).toBe('Invalid token.')
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

        describe('Validate token by GET method with id', () => {
            const exec = () => {
                return request(server)
                    .get(`/api/packings/${new_packing._id}`)
                    .set('Authorization', token)
            }

            it('should return 401 if no token is provided', async () => {
                token = ''
                const res = await exec()
                expect(res.status).toBe(401)
                expect(res.body.message).toBe('Access denied. No token provided.')
            })

            it('should return 400 if token is invalid', async () => {
                token = 'a'
                const res = await exec()
                expect(res.status).toBe(400)
                expect(res.body.message).toBe('Invalid token.')
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

        describe('Validate token by POST method', () => {
            const exec = () => {
                return request(server)
                    .post('/api/packings')
                    .set('Authorization', token)
                    .send(packing_body)
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

        describe('Validate token by PATCH method', () => {
            const exec = () => {
                return request(server)
                    .patch(`/api/packings/${new_packing._id}`)
                    .set('Authorization', token)
                    .send({ name: 'TESTE', type: 'client' })
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

        describe('Validate token by DELETE method', () => {
            const exec = () => {
                return request(server)
                    .delete(`/api/packings/${new_packing._id}`)
                    .set('Authorization', token)
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
    })

    describe('AUTHZ MIDDLEWARE', () => {
        const exec = () => {
            return request(server)
                .post('/api/packings')
                .set('Authorization', token)
                .send(packing_body)
        }
        it('should return 403 if user is not admin', async () => {
            user = {
                full_name: 'Teste Man',
                email: "serginho1@gmail.com",
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

    describe('GET: /api/packings', () => {
        it('should return all packings', async () => {
            await Packing.collection.insertMany([
                { tag: {code: 'teste 1'}, serial: 'teste 1'},
                { tag: {code: 'teste 2'}, serial: 'teste 2'},
                { tag: {code: 'teste 3'}, serial: 'teste 3'}
            ])

            const res = await request(server)
                .get('/api/packings')
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
            expect(res.body.some(p => p.serial === 'teste 1')).toBeTruthy()
            expect(res.body.some(p => p.serial === 'teste 2')).toBeTruthy()
            expect(res.body.some(p => p.serial === 'teste 3')).toBeTruthy()
        })
    })

    describe('GET /api/packings/:id', () => {
        it('should return a packing if valid id is passed', async () => {
            const packing = new Packing(packing_body)
            await packing.save()

            const res = await request(server)
                .get(`/api/packings/${packing._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('serial', packing.serial)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/packings/1a`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('POST: /api/packings', () => {
        let packing
        const exec = () => {
            return request(server)
                .post('/api/packings')
                .set('Authorization', token)
                .send({ 
                    tag: {
                        code: packing.tag.code
                    }, 
                    serial: packing.serial,
                    family: packing.family
                })
        }
        beforeEach(() => {
            packing = { 
                tag: { 
                    code: 'teste 1' 
                }, 
                serial: 'teste 1',
                family: new_family._id
            }
        })

        it('should return 400 if tag code is not provied', async () => {
            packing.tag.code = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if serial is not provied', async () => {
            packing.serial = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if family is not provied', async () => {
            packing.family = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if packing code tag already exists', async () => {
            await Packing.create(packing)

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 201 if packing is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(201)
        })

        it('should return packing if is valid request', async () => {
            const res = await exec()

            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'serial'])
            )
        })
    })

    describe('PATCH: /api/packings/:id', () => {
        let resp
        const exec = () => {
            return request(server)
                .patch(`/api/packings/${resp.body._id}`)
                .set('Authorization', token)
                .send({ 
                    tag: {
                        code: 'CODE edited'
                    }, 
                    serial: 'SERIAL edited',
                    family: new_family._id
                })
        }
        beforeEach(async () => {
            resp = await request(server)
                .post('/api/packings')
                .set('Authorization', token)
                .send(packing_body)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/packings/1`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return packing edited if is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.tag.code).toBe('CODE edited')
            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'serial'])
            )
        })
    })

    describe('DELETE: /api/packings/:id', () => {
        let resp
        const exec = () => {
            return request(server)
                .delete(`/api/packings/${resp.body._id}`)
                .set('Authorization', token)
        }

        it('should return 200 if deleted with success', async () => {
            resp = await request(server)
                .post('/api/packings')
                .set('Authorization', token)
                .send({
                    tag: {
                        code: 'CODE edited'
                    },
                    serial: 'SERIAL edited',
                    family: new_family._id
                })

            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Delete successfully')
        })
    })

})