const request = require('supertest')
const mongoose = require('mongoose')
const { User } = require('./users.model')
const { Company } = require('../companies/companies.model')
const _ = require('lodash')

describe('api/users', () => {
    let server
    let company_id
    let newCompany
    let token
    let newUser
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

        newUser = new User(user)
        await newUser.save()
        token = newUser.generateUserToken()
    })
    afterEach(async () => {
        await server.close()
        await User.deleteMany({})
        await Company.deleteMany({})
    })

    describe('AUTH MIDDLEWARE', () => {
        
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
                        .get(`/api/users/${newUser._id}`)
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
                        .get(`/api/users/${newUser._id}`)
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
                        .get(`/api/users/${newUser._id}`)
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
                    .send(newUser)
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
                    .post('/api/users')
                    .set('Authorization', token)
                    .send(newUser)
                }
                const res = await exec()
                expect(res.status).toBe(401)
                expect(res.body.message).toBe('Access denied. Token expired.')
            })*/
        })

        describe('Validate token by PATCH method', () => {
            const exec = () => {
                return request(server)
                    .patch(`/api/users/${newUser._id}`)
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
                    .patch(`/api/users/${newUser._id}`)
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
                    .delete(`/api/users/${newUser._id}`)
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
                    .delete(`/api/users/${newUser._id}`)
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
                const tokenUserTest = userTest.generateUserToken()
                const exec = () => {
                    return request(server)
                        .get(`/api/users/${newUser._id}`)
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

    describe('GET: /api/users', () => {
        it('should return all users', async () => {
            await User.collection.insertMany([{
                full_name: "test user 1",
                email: "teste_test@test.com",
                password: "123456",
                role: "admin",
                company: newCompany._id},
                {full_name: "test user 2",
                email: "teste1_test@test.com",
                password: "123456",
                role: "admin",
                company: newCompany._id
              }])

            let saveUsers = await User.find({})
                .select(["-password", "-created_at", "-update_at", "-__v"])
                .populate("company", ['id', 'name', 'type'])

            saveUsers = JSON.parse(JSON.stringify(saveUsers))
            const res = await request(server)
                .get('/api/users')
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.type).toBe('application/json')
            expect(res.body.length).toBe(3)

            const body = res.body.map((e) => _.omit(e, ["__v", "password", "created_at", "update_at", "company.created_at", 
                    "company.update_at", "company.__v"]))
            expect(body).toEqual(saveUsers)    
        })
        
        it('should return 404 if invalid url is passed', async () => { 
            const res = await request(server)
                .get(`/api/usersss`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('GET: /api/users/:id', () => {
        it('should return a user if valid id is passed', async () => {
            let user = await User.findById(newUser._id).select(["-password","-created_at", 
                "-update_at", "-__v"])
                .populate("company", ['id', 'name', 'type'])
            user = JSON.parse(JSON.stringify(user))
            const res = await request(server)
                .get(`/api/users/${newUser._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.type).toBe('application/json')
            const body = _.omit(res.body, ["__v", "password", "created_at", "update_at", "company.created_at", 
            "company.update_at", "company.__v"])
            expect(body).toEqual(user)
        })

        it('should return 404 if invalid id is passed', async () => { 
            const res = await request(server)
                .get(`/api/users/200`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid url with valid id is passed', async () => { 
            const res = await request(server)
                .get(`/api/userssss/${newUser._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('POST: /api/users', () => {
        let user

        beforeEach(async () => {
            user = {
                full_name: "Test Test",
                email: "test@test.com",
                password: "123456",
                role: "admin",
                company: newCompany._id
            }
        })

        let exec = () => {
            return request(server)
                .post('/api/users')
                .set('Authorization', token)
                .send(user)
        }

        it('should return 201 if user is created successfully', async () => {
            const res = await exec()
            delete user.password
            user = JSON.stringify(user)
            let body = _.omit(res.body, ["_id"])
            body = JSON.stringify(body)

            expect(res.status).toBe(201)
            expect(res.type).toBe('application/json')
            expect(body).toEqual(user)
        })

        it('should return 400 if create a user already existing', async () => {
            const newUser = new User(user)
            await newUser.save()
            
            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body.message).toEqual('User already registered.')
        })

        it('should return 201 if user is created successfully ' + 
            'when missing attributes not required', async () => {
            delete user.role

            const res = await exec()
            const body = JSON.stringify(_.omit(res.body, ["_id"]))
            user = {
                full_name: "Test Test",
                email: "test@test.com",
                role: "user",
                company: newCompany._id
            }
            user = JSON.stringify(user)

            expect(res.status).toBe(201)
            expect(res.type).toBe('application/json')
            expect(body).toEqual(user)
        })

        it('should return 400 if body is empty', async () => {
            exec = () => {
                return request(server)
                    .post('/api/users')
                    .set('Authorization', token)
                    .send({})
            }

            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"email\" is required",
                "\"password\" is required"
            ])
        })

        it('should return 404 if invalid url is provied', async () => {
            exec = () => {
                return request(server)
                    .post('/api/usersss')
                    .set('Authorization', token)
            }

            const res = await exec()
            expect(res.status).toBe(404)
        })

        it('should return 400 if body is not provied', async () => {
            exec = () => {
                return request(server)
                    .post('/api/users')
                    .set('Authorization', token)
            }
            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"email\" is required",
                "\"password\" is required"
            ])
        })

        it('should return 400 if unknow properties is present', async () => {
            user = {
                full_name: "Test Test",
                email: "test@test.com",
                password: "123456",
                role: "admin",
                company: newCompany._id,
                test: 'test'
            }

            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 400 if name is not present in the object', async () => {
            user = {
                email: "test@test.com",
                password: "123456",
                role: "admin",
                company: newCompany._id
            }
            
            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"name\" is required"
            ])  
        })

        it('should return 400 if the attribute types diferent than expected', async () => {
            user = {
                full_name: 111,
                email: 111,
                password: 111,
                role: 111,
                company: 111
            }

            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"full_name\" must be a string",
                "\"email\" must be a string",
                "\"password\" must be a string",
                "\"role\" must be a string",
                "\"company\" must be a string"
            ])
        })

        it('should return 400 if small amount of characters is provied', async () => {
            user = {
                full_name: "t",
                email: "te",
                password: "123",
                role: "admin",
                company: "5bc8ed3ca87a97474c98cad7"
            }
    
            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"full_name\" length must be at least 5 characters long",
                "\"email\" length must be at least 5 characters long",
                "\"email\" with value \"te\" fails to match the required pattern: /^(([^<>()[\\]\\\\.,;:\\s@\\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\\"]+)*)|(\\\".+\\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/",
                "\"password\" length must be at least 6 characters long"
            ])
        })

        it('should return 400 if attributes are empty', async () => {
            user = {
                full_name: "",
                email: "",
                password: "",
                role: "",
                company: ""
            }

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"full_name\" is not allowed to be empty",
                "\"full_name\" length must be at least 5 characters long",
                "\"email\" is not allowed to be empty",
                "\"email\" length must be at least 5 characters long",
                "\"email\" with value \"\" fails to match the required pattern: /^(([^<>()[\\]\\\\.,;:\\s@\\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\\"]+)*)|(\\\".+\\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/",
                "\"password\" is not allowed to be empty",
                "\"password\" length must be at least 6 characters long",
                "\"role\" is not allowed to be empty",
                "\"role\" must be one of [admin, user]",
                "\"company\" is not allowed to be empty",
                "\"company\" with value \"\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/"
            ])
        })

        it('should return 400 if large number of characters is provied', async () => {
            user.full_name = 'test useruhuuhuhuhuhuhuuuuuuhuhuuhuhuhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh'
            user.email = 'test@test.comkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk'
            user.role = 'adminasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasd'

            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"full_name\" length must be less than or equal to 255 characters long",
                "\"email\" length must be less than or equal to 255 characters long",
                "\"role\" must be one of [admin, user]"
            ])
        })
    })

    describe('POST: api/users/sign_in', () => {
        let login
        let user
        let userObj
        
        beforeEach(async () => {
            user = {
                full_name: 'Teste Man 10',
                email: "serginho1@gmail.com",
                password: "qwerty123",
                role: 'admin',
                company: {
                    _id: newCompany._id,
                    name: newCompany.name
                }
            }
            userObj = new User(user)
            await userObj.save()
            login = {
                email: user.email,
                password: user.password
            }
        })
        const exec = () => {
            return request(server)
                .post('/api/users/sign_in')
                .send(login)
        }
        
        it('should return 200 if user is valid request', async () => {
            let bodyRes = {
                _id: userObj._id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                company: user.company._id
            }
            bodyRes = JSON.parse(JSON.stringify(bodyRes))
            const res = await exec() 
            expect(res.status).toBe(200)
            expect(res.type).toBe('application/json')
            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'full_name', 'email', 'role', 'company', 'accessToken'])
            )
            const body = _.omit(res.body, ["accessToken"])
            expect(body).toEqual(bodyRes)
        })

        it('should return 400 if email is empty', async () => {
            login.email = ''

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual(["\"email\" is not allowed to be empty", "\"email\" length must be at least 5 characters long", "\"email\" with value \"\" fails to match the required pattern: /^(([^<>()[\\]\\\\.,;:\\s@\\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\\"]+)*)|(\\\".+\\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/"])
        })

        it('should return 400 if email is not provied', async () => {
            login = {
                password: user.password
            }

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"email\" is required"
            ])
        })

        it('should return 400 if password is not provided', async () => {
            login = {
                email: user.email
            }

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"password\" is required"
            ])
        })

        it('should return 400 if password is empty', async () => {
            login.password = ''

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"password\" is not allowed to be empty",
                "\"password\" length must be at least 6 characters long"
            ])
        })

        it('should return 400 if password not matches', async () => {
            login.password = 'asdfasdfasd'

            const res = await exec()
            console.log(res.body)
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body.message).toEqual('Invalid password')
        })

        it('should return 400 if the password is less than 6 characters', async () => {
            login.password = 'asdf'

            const res = await exec()
            console.log(res.body)
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"password\" length must be at least 6 characters long"
            ])
        })

        it('should return 400 if unknow attribute is provied', async () => {
            login.test = 'test'

            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })
    })

    /*
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