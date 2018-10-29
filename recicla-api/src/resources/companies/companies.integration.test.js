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
                        .delete(`/api/companies/${company._id}`)
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

        it('should return 201 if company is created successfully ' + 
            'when missing some attributes not required', async () => {
            const newCompany = {
                "name": "GM Motors",
                "address": {
                  "city": "Recife",
                  "street": "Rua teste",
                  "cep": "54280222",
                  "uf": "PE"
                }
            }
            const resBody = {
                type: "client",
                name: "GM Motors",
                address: {
                    city: "Recife",
                    street: "Rua teste",
                    cep: "54280222",
                    uf: "PE"
                }
            }
            exec = () => {
                return request(server)
                    .post('/api/companies')
                    .set('Authorization', token)
                    .send(newCompany)
            }
            const res = await exec()
            const body = _.omit(res.body, ["_id", "created_at", "update_at", "__v"])
            expect(res.status).toBe(201)
            expect(res.type).toBe('application/json')
            expect(body).toEqual(resBody)
        })

        it('should return 400 if body is empty', async () => {
            exec = () => {
                return request(server)
                    .post('/api/companies')
                    .set('Authorization', token)
                    .send({})
            }
            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"name\" is required"
            ])
        })

        it('should return 404 if invalid url is provied', async () => {
            exec = () => {
                return request(server)
                    .post('/api/companiesss')
                    .set('Authorization', token)
            }
            const res = await exec()
            expect(res.status).toBe(404)
        })

        it('should return 400 if body is not provied', async () => {
            exec = () => {
                return request(server)
                    .post('/api/companies')
                    .set('Authorization', token)
            }
            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"name\" is required"
            ])
        })

        it('should return 400 if unknow properties is present', async () => {
            const newCompany = {
                name: "GM Motors",
                phone: "11111111111",
                cnpj: "24690321000123",
                address: {
                  city: "Recife",
                  street: "Rua teste",
                  cep: "54280222",
                  uf: "PE"
                },
                type: "owner",
                test: "test"
            }
            exec = () => {
                return request(server)
                    .post('/api/companies')
                    .set('Authorization', token)
                    .send(newCompany)
            }
            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 400 if name is not present in the object', async () => {
            const newCompany = {
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
            exec = () => {
                return request(server)
                    .post('/api/companies')
                    .set('Authorization', token)
                    .send(newCompany)
            }
            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"name\" is required"
            ])  
        })

        it('should return 400 if the attribute types diferent than expected', async () => {
            const newCompany = {
                name: 111111111,
                phone: 1111111111,
                cnpj: 1111111111,
                address: {
                  city: 11111111,
                  street: 11111111,
                  cep: 11111111,
                  uf: 11
                },
                type: 111111
            }
            exec = () => {
                return request(server)
                    .post('/api/companies')
                    .set('Authorization', token)
                    .send(newCompany)
            }
            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"name\" must be a string",
                "\"phone\" must be a string",
                "\"cnpj\" must be a string",
                "\"city\" must be a string",
                "\"street\" must be a string",
                "\"cep\" must be a string",
                "\"uf\" must be a string",
                "\"type\" must be a string"
            ])
        })

        it('should return 400 if small amount of characters is provied', async () => {
            const newCompany = {
                "name": "GM Motors",
                "phone": "11",
                "cnpj": "24",
                "address": {
                  "city": "Re",
                  "street": "Ru",
                  "cep": "5",
                  "uf": "P"
                },
                "type": "owner"
            }
            exec = () => {
                return request(server)
                    .post('/api/companies')
                    .set('Authorization', token)
                    .send(newCompany)
            }
            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"phone\" length must be at least 10 characters long",
                "\"cnpj\" length must be at least 14 characters long",
                "\"city\" length must be at least 4 characters long",
                "\"street\" length must be at least 4 characters long",
                "\"cep\" length must be at least 8 characters long",
                "\"uf\" length must be at least 2 characters long"
            ])
        })

        it('should return 400 if attributes are empty', async () => {
            const newCompany = {
                "name": "",
                "phone": "",
                "cnpj": "",
                "address": {
                  "city": "",
                  "street": "",
                  "cep": "",
                  "uf": ""
                },
                "type": ""
            }
            exec = () => {
                return request(server)
                    .post('/api/companies')
                    .set('Authorization', token)
                    .send(newCompany)
            }
            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"name\" is not allowed to be empty",
                "\"name\" length must be at least 5 characters long",
                "\"phone\" is not allowed to be empty",
                "\"phone\" length must be at least 10 characters long",
                "\"cnpj\" is not allowed to be empty",
                "\"cnpj\" length must be at least 14 characters long",
                "\"city\" is not allowed to be empty",
                "\"city\" length must be at least 4 characters long",
                "\"street\" is not allowed to be empty",
                "\"street\" length must be at least 4 characters long",
                "\"cep\" is not allowed to be empty",
                "\"cep\" length must be at least 8 characters long",
                "\"uf\" is not allowed to be empty",
                "\"uf\" length must be at least 2 characters long",
                "\"type\" is not allowed to be empty",
                "\"type\" must be one of [owner, client]"
            ])
        })

        it('should return 400 if large number of characters is provied', async () => {
            const newCompany = {
                "name": "GM Motorshhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
                "phone": "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
                "cnpj": "24690321000123111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
                "address": {
                  "city": "Recifehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
                  "street": "Rua testehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh1hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
                  "cep": "5428022211111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
                  "uf": "PE"
                },
                "type": "owner"
              }
            exec = () => {
                return request(server)
                    .post('/api/companies')
                    .set('Authorization', token)
                    .send(newCompany)
            }
            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"name\" length must be less than or equal to 50 characters long",
                "\"phone\" length must be less than or equal to 14 characters long",
                "\"cnpj\" length must be less than or equal to 20 characters long",
                "\"city\" length must be less than or equal to 50 characters long",
                "\"street\" length must be less than or equal to 50 characters long",
                "\"cep\" length must be less than or equal to 9 characters long"
            ])
        })
    })

    describe('PATCH: /api/companies/:id', () => {

        it('should return 201 if company is updated successfully', async () => {
            const newCompany = new Company({ 
                name: "Company 1",
                cnpj: "91289532000146",
                phone: "11111111111",
                address: {
                    city: "Recife",
                    street: "Rua teste",
                    cep: "54280222",
                    uf: "PE"
                },
                type: "owner"})
            await newCompany.save()
            const updatedCompany = {
                name: "Toyota",
                phone: "22222222222",
                cnpj: "24690321000124",
                address: {
                  city: "Olinda",
                  street: "Rua teste olinda",
                  cep: "54280224",
                  uf: "PB"
                },
                type: "client"
            }
            const exec = () => {
                return request(server)
                    .patch(`/api/companies/${newCompany._id}`)
                    .set('Authorization', token)
                    .send(updatedCompany)
            }
            const res = await exec()
            const body = _.omit(res.body, ["_id", "created_at", "update_at", "__v"])
            expect(res.status).toBe(200)
            expect(res.type).toBe('application/json')
            expect(body).toEqual(updatedCompany)
        })

        it('should return 201 if company is updated successfully ' + 
            'when missing some attributes not required', async () => {
            const newCompany = new Company({ 
                name: "Company 1",
                cnpj: "91289532000146",
                phone: "11111111111",
                address: {
                    city: "Recife",
                    street: "Rua teste",
                    cep: "54280222",
                    uf: "PE"
                },
                type: "owner"})
            await newCompany.save()
            const updatedCompany = {
                name: "GM Motors",
                address: {
                  city: "Recife",
                  street: "Rua teste",
                  cep: "54280222",
                  uf: "PE"
                }
            }
            const resBody = {
                name: "GM Motors",
                cnpj: "91289532000146",
                phone: "11111111111",
                address: {
                  city: "Recife",
                  street: "Rua teste",
                  cep: "54280222",
                  uf: "PE"
                },
                type: "owner"
            }
            exec = () => {
                return request(server)
                    .patch(`/api/companies/${newCompany._id}`)
                    .set('Authorization', token)
                    .send(updatedCompany)
            }
            const res = await exec()
            const body = _.omit(res.body, ["_id", "created_at", "update_at", "__v"])
            expect(res.status).toBe(200)
            expect(res.type).toBe('application/json')
            expect(body).toEqual(resBody)
        })

        it('should return 400 if body is empty', async () => {
            const newCompany = new Company({ 
                name: "Company 1",
                cnpj: "91289532000146",
                phone: "11111111111",
                address: {
                    city: "Recife",
                    street: "Rua teste",
                    cep: "54280222",
                    uf: "PE"
                },
                type: "owner"})
            await newCompany.save()
            exec = () => {
                return request(server)
                    .patch(`/api/companies/${newCompany._id}`)
                    .set('Authorization', token)
                    .send({})
            }
            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"name\" is required"
            ])
        })

        it('should return 404 if invalid url is provied', async () => {
            const newCompany = new Company({ 
                name: "Company 1",
                cnpj: "91289532000146",
                phone: "11111111111",
                address: {
                    city: "Recife",
                    street: "Rua teste",
                    cep: "54280222",
                    uf: "PE"
                },
                type: "owner"})
            await newCompany.save()
            exec = () => {
                return request(server)
                    .patch(`/api/companiesss/${newCompany._id}`)
                    .set('Authorization', token)
            }
            const res = await exec()
            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid id is provied', async () => {
            exec = () => {
                return request(server)
                    .patch(`/api/companiesss/aaaaaaaa`)
                    .set('Authorization', token)
            }
            const res = await exec()
            expect(res.status).toBe(404)
        })

        it('should return 400 if body is not provied', async () => {
            const newCompany = new Company({ 
                name: "Company 1",
                cnpj: "91289532000146",
                phone: "11111111111",
                address: {
                    city: "Recife",
                    street: "Rua teste",
                    cep: "54280222",
                    uf: "PE"
                },
                type: "owner"})
            await newCompany.save()
            exec = () => {
                return request(server)
                    .patch(`/api/companies/${newCompany._id}`)
                    .set('Authorization', token)
            }
            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"name\" is required"
            ])
        })

        it('should return 400 if unknow properties is present', async () => {
            const newCompany = new Company({ 
                name: "Company 1",
                cnpj: "91289532000146",
                phone: "11111111111",
                address: {
                    city: "Recife",
                    street: "Rua teste",
                    cep: "54280222",
                    uf: "PE"
                },
                type: "owner"})
            await newCompany.save()
            const updatedCompany = {
                name: "Toyota",
                phone: "22222222222",
                cnpj: "24690321000124",
                address: {
                  city: "Olinda",
                  street: "Rua teste olinda",
                  cep: "54280224",
                  uf: "PB"
                },
                type: "client",
                test: "test"
            }
            exec = () => {
                return request(server)
                    .patch(`/api/companies/${newCompany._id}`)
                    .set('Authorization', token)
                    .send(updatedCompany)
            }
            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 400 if name is not present in the object', async () => {
            const newCompany = new Company({ 
                name: "Company 1",
                cnpj: "91289532000146",
                phone: "11111111111",
                address: {
                    city: "Recife",
                    street: "Rua teste",
                    cep: "54280222",
                    uf: "PE"
                },
                type: "owner"})
            await newCompany.save()
            const updatedCompany = {
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
            exec = () => {
                return request(server)
                    .patch(`/api/companies/${newCompany._id}`)
                    .set('Authorization', token)
                    .send(updatedCompany)
            }
            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"name\" is required"
            ])  
        })

        it('should return 400 if the attribute types diferent than expected', async () => {
            const newCompany = new Company({ 
                name: "Company 1",
                cnpj: "91289532000146",
                phone: "11111111111",
                address: {
                    city: "Recife",
                    street: "Rua teste",
                    cep: "54280222",
                    uf: "PE"
                },
                type: "owner"})
            await newCompany.save()
            const updatedCompany = {
                name: 111111111,
                phone: 1111111111,
                cnpj: 1111111111,
                address: {
                  city: 11111111,
                  street: 11111111,
                  cep: 11111111,
                  uf: 11
                },
                type: 111111
            }
            exec = () => {
                return request(server)
                .patch(`/api/companies/${newCompany._id}`)
                    .set('Authorization', token)
                    .send(updatedCompany)
            }
            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"name\" must be a string",
                "\"phone\" must be a string",
                "\"cnpj\" must be a string",
                "\"city\" must be a string",
                "\"street\" must be a string",
                "\"cep\" must be a string",
                "\"uf\" must be a string",
                "\"type\" must be a string"
            ])
        })

        it('should return 400 if small amount of characters is provied', async () => {
            const newCompany = new Company({ 
                name: "Company 1",
                cnpj: "91289532000146",
                phone: "11111111111",
                address: {
                    city: "Recife",
                    street: "Rua teste",
                    cep: "54280222",
                    uf: "PE"
                },
                type: "owner"})
            await newCompany.save()
            const updatedCompany = {
                "name": "GM Motors",
                "phone": "11",
                "cnpj": "24",
                "address": {
                  "city": "Re",
                  "street": "Ru",
                  "cep": "5",
                  "uf": "P"
                },
                "type": "owner"
            }
            exec = () => {
                return request(server)
                    .patch(`/api/companies/${newCompany._id}`)
                    .set('Authorization', token)
                    .send(updatedCompany)
            }
            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"phone\" length must be at least 10 characters long",
                "\"cnpj\" length must be at least 14 characters long",
                "\"city\" length must be at least 4 characters long",
                "\"street\" length must be at least 4 characters long",
                "\"cep\" length must be at least 8 characters long",
                "\"uf\" length must be at least 2 characters long"
            ])
        })

        it('should return 400 if attributes are empty', async () => {
            const newCompany = new Company({ 
                name: "Company 1",
                cnpj: "91289532000146",
                phone: "11111111111",
                address: {
                    city: "Recife",
                    street: "Rua teste",
                    cep: "54280222",
                    uf: "PE"
                },
                type: "owner"})
            await newCompany.save()
            const updatedCompany = {
                "name": "",
                "phone": "",
                "cnpj": "",
                "address": {
                  "city": "",
                  "street": "",
                  "cep": "",
                  "uf": ""
                },
                "type": ""
            }
            exec = () => {
                return request(server)
                    .patch(`/api/companies/${newCompany._id}`)
                    .set('Authorization', token)
                    .send(updatedCompany)
            }
            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"name\" is not allowed to be empty",
                "\"name\" length must be at least 5 characters long",
                "\"phone\" is not allowed to be empty",
                "\"phone\" length must be at least 10 characters long",
                "\"cnpj\" is not allowed to be empty",
                "\"cnpj\" length must be at least 14 characters long",
                "\"city\" is not allowed to be empty",
                "\"city\" length must be at least 4 characters long",
                "\"street\" is not allowed to be empty",
                "\"street\" length must be at least 4 characters long",
                "\"cep\" is not allowed to be empty",
                "\"cep\" length must be at least 8 characters long",
                "\"uf\" is not allowed to be empty",
                "\"uf\" length must be at least 2 characters long",
                "\"type\" is not allowed to be empty",
                "\"type\" must be one of [owner, client]"
            ])
        })

        it('should return 400 if large number of characters is provied', async () => {
            const newCompany = new Company({ 
                name: "Company 1",
                cnpj: "91289532000146",
                phone: "11111111111",
                address: {
                    city: "Recife",
                    street: "Rua teste",
                    cep: "54280222",
                    uf: "PE"
                },
                type: "owner"})
            await newCompany.save()
            const updatedCompany = {
                "name": "GM Motorshhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
                "phone": "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
                "cnpj": "24690321000123111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
                "address": {
                  "city": "Recifehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
                  "street": "Rua testehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh1hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
                  "cep": "5428022211111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
                  "uf": "PE"
                },
                "type": "owner"
              }
            exec = () => {
                return request(server)
                    .patch(`/api/companies/${newCompany._id}`)
                    .set('Authorization', token)
                    .send(updatedCompany)
            }
            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"name\" length must be less than or equal to 50 characters long",
                "\"phone\" length must be less than or equal to 14 characters long",
                "\"cnpj\" length must be less than or equal to 20 characters long",
                "\"city\" length must be less than or equal to 50 characters long",
                "\"street\" length must be less than or equal to 50 characters long",
                "\"cep\" length must be less than or equal to 9 characters long"
            ])
        })
    })

    describe('DELETE: /api/companies/:id', () => {
        it('should return 200 if deleted with success', async () => {
            const newCompany = new Company({ 
                name: "Company 1",
                cnpj: "91289532000146",
                phone: "11111111111",
                address: {
                    city: "Recife",
                    street: "Rua teste",
                    cep: "54280222",
                    uf: "PE"
                },
                type: "owner"})
            await newCompany.save()
            const exec = () => {
                return request(server)
                    .delete(`/api/companies/${newCompany._id}`)
                    .set('Authorization', token)
            }
            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Delete successfully')
        })

        it('should return 404 if id is not provied', async () => {
            const exec = () => {
                return request(server)
                    .delete(`/api/companies/`)
                    .set('Authorization', token)
            }
            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid id is provied', async () => {
            const exec = () => {
                return request(server)
                    .delete(`/api/companies/aaaaaaaaa`)
                    .set('Authorization', token)
            }
            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid url is provied', async () => {
            const newCompany = new Company({ 
                name: "Company 1",
                cnpj: "91289532000146",
                phone: "11111111111",
                address: {
                    city: "Recife",
                    street: "Rua teste",
                    cep: "54280222",
                    uf: "PE"
                },
                type: "owner"})
            await newCompany.save()
            const exec = () => {
                return request(server)
                    .delete(`/api/companiesssss/${newCompany._id}`)
                    .set('Authorization', token)
            }
            const res = await exec()

            expect(res.status).toBe(404)
        })
    })

})