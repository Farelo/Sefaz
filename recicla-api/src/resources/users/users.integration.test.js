const request = require('supertest')
const mongoose = require('mongoose')
const { User } = require('./users.model')
const { Company } = require('../companies/companies.model')

describe('api/users', () => {
    let server
    let company_id
    let newCompany
    let token
    beforeEach(async () => {
        server = require('../../server')

        company_id = mongoose.Types.ObjectId()
        newCompany = new Company({ _id: company_id, name: 'CEBRACE TESTE'})
        await newCompany.save()

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

        const newUser = new User(user)
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
        
        const user = new User ({
            full_name: 'Teste Man 2',
            email: "teste@teste.com",
            password: "qwerty123",
            role: 'admin',
            company: {
                _id: company._id,
                name: company.name
            }
        })
        user.save()

        describe('Validate token by GET method without id', () => {
            const exec = () => {
                return request(server)
                    .get('/api/users')
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
                        .get(`/api/users/${user._id}`)
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
                        .get(`/api/users/${user._id}`)
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
                    .post('/api/users')
                    .set('Authorization', token)
                    .send({full_name: 'Teste Man 3',
                        email: "teste1@teste.com",
                        password: "qwerty123",
                        role: 'admin',
                        company: {
                            _id: newCompany._id,
                            name: newCompany.name
                        }
                    })
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
                    .patch(`/api/users/${user._id}`)
                    .set('Authorization', token)
                    .send({ full_name: 'teste' })
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
                    .delete(`/api/users/${user._id}`)
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
        newUser.save()
        describe('Validate authorization by POST', () => {
            it('should return 403 if user is not admin by POST', async () => {
                const exec = () => {
                    return request(server)
                        .post('/api/users')
                        .set('Authorization', tokenUser)
                        .send({ full_name: 'test' })
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })        
        })

        describe('Validate authorization by GET', () => {
            it('should return 403 if user is not admin by GET', async () => {
                const exec = () => {
                    return request(server)
                        .get('/api/users')
                        .set('Authorization', tokenUser)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })

            it('should return 403 if user is not admin by GET with id', async () => {
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
                const userTest = new User(userUser)
                userTest.save()
                console.log(userTest)
                const tokenUserTest = userTest.generateUserToken()
                const exec = () => {
                    return request(server)
                        .get(`/api/users/${userTest._id}`)
                        .set('Authorization', tokenUserTest)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })        
        })

        describe('Validate authorization by PATCH', () => {
            it('should return 403 if user is not admin by PATCH', async () => {
                const exec = () => {
                    return request(server)
                        .patch(`/api/users/${newUser._id}`)
                        .set('Authorization', tokenUser)
                        .send({full_name: "teste"})
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })
        })

        describe('Validate authorization by DELETE', () => {
            it('should return 403 if user is not admin by DELETE', async () => {
                const exec = () => {
                    return request(server)
                        .delete(`/api/users/${newUser._id}`)
                        .set('Authorization', tokenUser)
                }
                const res = await exec()
                expect(res.status).toBe(403)
            })
        })
    })

    /*describe('AUTH MIDDLEWARE', () => {
        const exec = () => {
            return request(server)
                .post('/api/users')
                .set('Authorization', token)
                .send({ full_name: 'Teste Man', email: "giorgiosaints@gmail.com", password: "12345678", role: 'admin', company: company_id })
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
                .post('/api/users')
                .set('Authorization', token)
                .send({ full_name: 'Teste Man', email: "giorgiosaints@gmail.com", password: "12345678", role: 'user', company: newCompany._id })
        }
        it('should return 403 if user is not admin', async () => {
            user = {
                full_name: 'Teste Man',
                email: "serginho@gmail.com",
                password: "qwerty123",
                role: 'user',
                company: {
                    _id: newCompany._id,
                    name: newCompany.name
                }
            }

            const newUser = new User(user)
            token = newUser.generateUserToken()

            const res = await exec()
            expect(res.status).toBe(403)
        })

        it('should return 201 if user is admin', async () => {
            const res = await exec()
            expect(res.status).toBe(201)
        })
    })

    describe('POST: api/users/sign_in', () => {
        let user
        const exec = () => {
            return request(server)
                .post('/api/users/sign_in')
                .send({ full_name: 'Teste Man', email: user.email, password: user.password, company: newCompany._id })
        }
        beforeEach(async () => {
            user = { full_name: 'Teste Man', email: 'serginho@gmail.com', password: 'qwerty123', company: newCompany._id }
            const newUser = new User(user)

            await newUser.save()
        })

        it('should return 400 if email is not provided', async () => {
            user.email = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if password is not provided', async () => {
            user.password = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if password not matches', async () => {
            user.password = 'qwerty1234'

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 200 if user is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(200)
        })

        it('should return user if is valid request', async () => {
            const res = await exec()

            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['full_name', 'email', 'role', 'accessToken'])
            )
        })
    })

    describe('GET api/users', () => {
        it('should return all users', async () => {
            await User.collection.insertMany([
                { full_name: 'Teste Man', email: "email1@gmail.com", password: '12345678', company: company_id},
                { full_name: 'Teste Man', email: "email2@gmail.com", password: '12345678', company: company_id},
                { full_name: 'Teste Man', email: "email3@gmail.com", password: '12345678', company: company_id}
            ])

            const res = await request(server).get('/api/users').set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
            expect(res.body.some(p => p.email === 'email1@gmail.com')).toBeTruthy()
            expect(res.body.some(p => p.email === 'email2@gmail.com')).toBeTruthy()
            expect(res.body.some(p => p.email === 'email3@gmail.com')).toBeTruthy()
        })
    })

    describe('GET: api/users/:id', () => {
        it('should return a user if valid id is passed', async () => {
            const newUser = new User({ full_name: 'Teste Man', email: 'serginho@gmail.com', password: 'qwerty123', company: company_id })
            await newUser.save()

            const res = await request(server)
                .get(`/api/users/${newUser._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('email', newUser.email)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/users/1a`)
                .set('Authorization', token)
            expect(res.status).toBe(404)
        })
    })

    describe('POST: api/users', () => {
        let user
        const exec = () => {
            return request(server)
                .post('/api/users')
                .set('Authorization', token)
                .send({ full_name: user.full_name, email: user.email, password: user.password, company: company_id })
        }
        beforeEach(async () => {
            user = {
                full_name: 'Teste Man',
                email: "serginho@gmail.com",
                password: "qwerty123", 
                company: { 
                    _id: newCompany._id,
                    name: newCompany.name
                } 
            }
        })
        
        it('should return 400 if email is not provied', async () => {
            user.email = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if password is not provied', async () => {
            user.password = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if user already registered', async () => {
            const newUser = new User(user)
            await newUser.save()

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 201 if user is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(201)
        })

        it('should return user if is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(201)
            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'email'])
            )
        })
    })    

    describe('PATCH: /api/users/:id', () => {
        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/users/1`)
                .set('Authorization', token)
            expect(res.status).toBe(404)
        })

        it('should return user edited if is valid request', async () => {
            const user = await request(server)
                .post('/api/users')
                .set('Authorization', token)
                .send({ full_name: 'Teste Man', email: 'emaill@email.com', password: '12345678', role: 'user', company: newCompany._id })
                    
            const res = await request(server)
                .patch(`/api/users/${user.body._id}`)
                .set('Authorization', token)
                .send({ full_name: 'Teste Edited', email: 'emailedited@email.com', password: '12345678', company: newCompany._id })

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('full_name', 'Teste Edited')
            expect(res.body).toHaveProperty('email', 'emailedited@email.com')
        })
    })

    describe('DELETE: /api/users/:id', () => {
        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/users/1`)
                .set('Authorization', token)
            expect(res.status).toBe(404)
        })
        
        it('should delete when given a valid _id', async () => {
            const newUser = new User({ full_name: 'Teste Man', email: 'emailedited@email.com', password: '12345678', company: newCompany._id })
            await newUser.save()

            const res = await request(server)
                .delete(`/api/users/${newUser._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Delete successfully')
        })
    })*/

})