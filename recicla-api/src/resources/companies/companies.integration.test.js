const request = require('supertest')
const mongoose = require('mongoose')
const _ = require('lodash')
const { Company } = require('./companies.model')
const { User } = require('../users/users.model')

describe('api/companies', () => {
    let server
    let company_id
    let newCompany
    let newUser
    let token

    beforeEach(async () => {
        server = require('../../server')

        company_id = mongoose.Types.ObjectId()
        newCompany = new Company({ _id: company_id, name: 'CEBRACE TESTE' })
        // await newCompany.save()
        
        const user = {
            full_name: 'Teste Man',
            email: "serginho@gmail.com",
            password: "qwerty123",
            role: 'admin',
            company: {
                _id: newCompany._id,
                name: newCompany.name
            }
        }
        
        newUser = new User(user)
        // await newUser.save()
        token = newUser.generateUserToken()
    })

    afterEach(async () => {
        await server.close()
        await User.deleteMany({})
        await Company.deleteMany({})
    })

    describe('AUTH MIDDLEWARE', () => {
        const company = new Company({ 
            name: "Company 1",
            cnpj: "91289532000146",
            phone: "11111111111",
            address: {
                city: "Recife",
                street: "Rua teste",
                cep: "54280222",
                uf: "PE"
            }})
        company.save()

        describe('Validate token by GET method without id', () => {
            const exec = () => {
                return request(server)
                    .get('/api/companies')
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
            it('should return 401 if no token is provided', async () => {
                token = ''
                const exec = () => {
                    return request(server)
                        .get(`/api/companies/${company._id}`)
                        .set('Authorization', token)
                }
                const res = await exec()
                expect(res.status).toBe(401)
                expect(res.body.message).toBe('Access denied. No token provided.')
            })

            it('should return 400 if token is invalid', async () => {
               
                token = 'a'
                const exec = () => {
                    return request(server)
                        .get(`/api/companies/${company._id}`)
                        .set('Authorization', token)
                }
                const res = await exec()
                expect(res.status).toBe(400)
                expect(res.body.message).toBe('Invalid token.')
            })

            /*it('should return 401 if token is expired', async () => {
                
                token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                'eyJfaWQiOiI1YmM4OTViZTJhYzUyMzI5MDAyMjA4ODQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1Mzk4ODg2MTJ9.' +
                'RjCQrcM99f9bi_zST1RlxHQ3TNBHFiOyMTcf1Mi7u8I'
                const exec = () => {
                    return request(server)
                        .get(`/api/companies/${company._id}`)
                        .set('Authorization', token)
                }
                const res = await exec()
                expect(res.status).toBe(401)
                expect(res.body.message).toBe('Access denied. Token expired.')
            })*/
        })

        describe('Validate token by POST method', () => {
            const exec = () => {
                return request(server)
                    .post('/api/companies')
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
                const exec = () => {
                return request(server)
                    .post('/api/companies')
                    .set('Authorization', token)
                    .send({ name: 'TESTE', type: 'client' })
                }
                const res = await exec()
                expect(res.status).toBe(401)
                expect(res.body.message).toBe('Access denied. Token expired.')
            })*/
        })

        describe('Validate token by PATCH method', () => {
            const exec = () => {
                return request(server)
                    .patch(`/api/companies/${company._id}`)
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
                const exec = () => {
                return request(server)
                    .patch(`/api/companies/${company._id}`)
                    .set('Authorization', token)
                    .send({ name: 'TESTE', type: 'client' })
                }
                const res = await exec()
                expect(res.status).toBe(401)
                expect(res.body.message).toBe('Access denied. Token expired.')
            })*/
        })

        describe('Validate token by DELETE method', () => {
            const exec = () => {
                return request(server)
                    .delete(`/api/companies/${company._id}`)
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
                const exec = () => {
                return request(server)
                    .delete(`/api/companies/${company._id}`)
                    .set('Authorization', token)
                }
                const res = await exec()
                expect(res.status).toBe(401)
                expect(res.body.message).toBe('Access denied. Token expired.')
            })*/
        })
    })

    describe('AUTHZ MIDDLEWARE', () => {
        const company = new Company({ 
            name: "Company 1",
            cnpj: "91289532000146",
            phone: "11111111111",
            address: {
                city: "Recife",
                street: "Rua teste",
                cep: "54280222",
                uf: "PE"
            }})
        company.save()
        const userUser = {
                    full_name: 'Teste Man 3',
                    email: "testet@gmail.com",
                    password: "qwerty123",
                    role: 'user',
                    company: {
                        _id: company._id,
                        name: company.name
                    }
                }
        const newUser = new User(userUser)
        const tokenUser = newUser.generateUserToken()

        describe('Validate authorization by POST', () => {
            it('should return 403 if user is not admin by POST', async () => {
                const exec = () => {
                    return request(server)
                        .post('/api/companies')
                        .set('Authorization', tokenUser)
                        .send({ name: 'TESTE', type: 'client' })
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })        
        })

        describe('Validate authorization by GET', () => {
            it('should return 403 if user is not admin by GET', async () => {
                const exec = () => {
                    return request(server)
                        .get('/api/companies')
                        .set('Authorization', tokenUser)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })

            it('should return 403 if user is not admin by GET with id', async () => {
                const exec = () => {
                    return request(server)
                        .get(`/api/companies/${company._id}`)
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
                        .patch(`/api/companies/${company._id}`)
                        .set('Authorization', tokenUser)
                        .send({name: "teste"})
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })
        })

        describe('Validate authorization by DELETE', () => {
            it('should return 403 if user is not admin by DELETE', async () => {
                const exec = () => {
                    return request(server)
                        .patch(`/api/companies/${company._id}`)
                        .set('Authorization', tokenUser)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })
        })
    })

    describe('GET: /api/companies', () => {
        it('should return all companies', async () => {
            await Company.collection.insertMany([{ 
                name: "Company 1",
                cnpj: "91289532000146",
                phone: "11111111111",
                address: {
                    city: "Recife",
                    street: "Rua teste",
                    cep: "54280222",
                    uf: "PE"
                },
                type: "owner" }, 
                { name: "Company 2",
                phone: "11111111111",
                cnpj: "24690321000123",
                address: {
                    city: "Recife",
                    street: "Rua teste",
                    cep: "54280222",
                    uf: "PE"
                },
                type: "owner"}])
            let saveCompanies = await Company.find({}).select(["-created_at", "-update_at"])
            saveCompanies = JSON.parse(JSON.stringify(saveCompanies))
            const res = await request(server)
                .get('/api/companies')
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.type).toBe('application/json')
            expect(res.body.length).toBe(2)

            const body = res.body.map((e) => _.omit(e, ["created_at", "update_at"]))
            expect(body).toEqual(saveCompanies)    
        })
        
        it('should return 404 if invalid url is passed', async () => { 
            const res = await request(server)
                .get(`/api/companiesss`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('GET: /api/companies/:id', () => {
        it('should return a company if valid id is passed', async () => {
            const company = new Company({ 
                name: "Company 1",
                cnpj: "91289532000146",
                phone: "11111111111",
                address: {
                    city: "Recife",
                    street: "Rua teste",
                    cep: "54280222",
                    uf: "PE"
                }})
            await company.save()
            let saveCompany = await Company.findById(company._id).select(["-created_at", "-update_at", "-__v"])
            saveCompany = JSON.parse(JSON.stringify(saveCompany))
            const res = await request(server)
                .get(`/api/companies/${company._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.type).toBe('application/json')
            const body = _.omit(res.body, ["created_at", "update_at", "__v"])
            expect(body).toEqual(saveCompany)
        })

        it('should return 404 if invalid id is passed', async () => { 
            const res = await request(server)
                .get(`/api/companies/200`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid url with valid id is passed', async () => { 
            const company = new Company({ 
                name: "Company 1",
                cnpj: "91289532000146",
                phone: "11111111111",
                address: {
                    city: "Recife",
                    street: "Rua teste",
                    cep: "54280222",
                    uf: "PE"
                }})
            await company.save()
            const res = await request(server)
                .get(`/api/companiesss/${company._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('POST: /api/companies', () => {
        let company = {
            name: "GM Motors",
            phone: "11111111111",
            cnpj: "24690321000123",
            address: {
              city: "Recife",
              street: "Rua teste",
              cep: "54280222",
              uf: "PE"
            },
            type: "owner"
        }
        let exec = () => {
            return request(server)
                .post('/api/companies')
                .set('Authorization', token)
                .send(company)
        }

        it('should return 201 if company is created successfully', async () => {
            const res = await exec()
            const body = _.omit(res.body, ["_id", "created_at", "update_at", "__v"])
            expect(res.status).toBe(201)
            expect(res.type).toBe('application/json')
            expect(body).toEqual(company)
        })

        it('should return 400 if name is not provied', async () => {
            company.name = ''
            
            const res = await exec()
            expect(res.status).toBe(400)
        })
    })

    describe('PATCH: /api/companies/:id', () => {
        let resp
        const exec = () => {
            return request(server)
                .patch(`/api/companies/${resp.body._id}`)
                .set('Authorization', token)
                .send({ name: 'TesteName edited' })
        }
        beforeEach(async () => {
            resp = await request(server)
                .post('/api/companies')
                .set('Authorization', token)
                .send({ name: 'company.name' })
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/companies/1`)
                .set('Authorization', token)

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
            return request(server)
                .delete(`/api/companies/${resp.body._id}`)
                .set('Authorization', token)
        }

        it('should return 200 if deleted with success', async () => {
            resp = await request(server)
                .post('/api/companies')
                .set('Authorization', token)
                .send({ name: 'company.name' })

            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Delete successfully')
        })
    })

})