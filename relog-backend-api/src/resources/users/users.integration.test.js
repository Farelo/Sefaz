const request = require('supertest')
const { User } = require('./users.model')
const { Company } = require('../companies/companies.model')
const _ = require('lodash')

describe('api/users', () => {
    let server
    let newCompany
    let token
    let newUser
    let user_body
    beforeEach(async () => {
        server = require('../../server')

        newCompany = new Company({ name: 'CEBRACE TESTE', type: 'owner' })
        await newCompany.save()

        user_body = {
            full_name: 'Teste Man',
            email: "serginho@gmail.com",
            password: "qwerty123",
            role: 'admin',
            company: newCompany._id
        }

        newUser = new User(user_body)
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

            it('should return 401 if token is invalid', async () => {
                token = 'a'
                const res = await exec()
                expect(res.status).toBe(401)
                expect(res.body.message).toBe('Invalid token.')
            })
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

            it('should return 401 if token is invalid', async () => {
                token = 'a'
                const exec = () => {
                    return request(server)
                        .get(`/api/users/${newUser._id}`)
                        .set('Authorization', token)
                }
                const res = await exec()
                expect(res.status).toBe(401)
                expect(res.body.message).toBe('Invalid token.')
            })

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
                expect(res.status).toBe(401)
            })

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
    
            it('should return 401 if token is invalid', async () => {
                token = 'a'
                const res = await exec()
                expect(res.status).toBe(401)
            })
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
    
            it('should return 401 if token is invalid', async () => {
                token = 'a'
                const res = await exec()
                expect(res.status).toBe(401)
            })
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

        it('should return 201 if fields not required is not provied', async () => {
            delete user.full_name
            delete user.role

            const res = await exec()
            const body = JSON.stringify(_.omit(res.body, ["_id"]))
            user = {
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

            exec = () => {
                return request(server)
                    .post('/api/users')
                    .set('Authorization', token)
                    .send(user)
            }

            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"test\" is not allowed"
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
                full_name: "test",
                email: "test",
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
                "\"email\" with value \"test\" fails to match the required pattern: /^(([^<>()[\\]\\\\.,;:\\s@\\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\\"]+)*)|(\\\".+\\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/",
                "\"password\" length must be at least 4 characters long"
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
                "\"password\" length must be at least 4 characters long",
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

        it('should return 400 if invalid company id is provied', async () => {
            user.company = '5bf6e775909f16352f1f3b6daa'

            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"company\" with value \"5bf6e775909f16352f1f3b6daa\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/"
            ])            
        })

        it('should return 404 if invalid url is provied', async () => {
            exec = () => {
                return request(server)
                    .post('/api/usersss')
                    .set('Authorization', token)
                    .send(user)
            }

            const res = await exec()

            expect(res.status).toBe(404)
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
        let exec = () => {
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
            delete login.email

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"email\" is required"
            ])
        })

        it('should return 400 if password is not provided', async () => {
            delete login.password

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
                "\"password\" length must be at least 4 characters long"
            ])
        })

        it('should return 400 if password not matches', async () => {
            login.password = 'asdfasdfasd'

            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body.message).toEqual('Invalid password')
        })

        it('should return 400 if the password is less than 6 characters', async () => {
            login.password = 'asdf'

            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body.message).toBe('Invalid password')
        })

        it('should return 400 if unknow attribute is provied', async () => {
            login.test = 'test'

            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 404 if invalid url is provied', async () => {
            exec = () => {
                return request(server)
                    .post('/api/users/sign_inss')
                    .set('Authorization', token)
                    .send(login)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })
    })

    describe('PATCH: /api/users/:id', () => {
        let exec

        beforeEach(async () => {
            user_body = JSON.parse(JSON.stringify(newUser))
            delete user_body.__v
            delete user_body.active
            delete user_body.created_at
            delete user_body.update_at
            delete user_body._id

            exec = () => {
                return request(server)
                .patch(`/api/users/${newUser._id}`)
                .set('Authorization', token)
                .send(user_body)
            }
        })

        it('should return 200 if user is created successfully', async () => { 
            user_body.full_name = 'Teste Edited'    
            user_body.email = 'emailedited@email.com'
            
            
            const res = await exec()
            user_body._id = newUser._id
            delete user_body.password
            user_body = JSON.parse(JSON.stringify(user_body))
            
            expect(res.status).toBe(200)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual(user_body)
        })

        it('should return 200 if fields not required is not provied', async () => {
            delete user_body.full_name
            delete user_body.role

            const res = await exec()
            user_body._id = newUser._id
            user_body.full_name = newUser.full_name
            user_body.role = newUser.role
            delete user_body.password
            user_body = JSON.parse(JSON.stringify(user_body))
            
            expect(res.status).toBe(200)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual(user_body)
        })

        it('should return 400 if body is empty', async () => {
            exec = () => {
                return request(server)
                    .patch(`/api/users/${newUser._id}`)
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
                    .patch(`/api/usersss/${newUser._id}`)
                    .set('Authorization', token)
                    .send(user_body)
            }

            const res = await exec()
            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid id is provied', async () => {
            exec = () => {
                return request(server)
                    .patch(`/api/users/aa`)
                    .set('Authorization', token)
                    .send(user_body)
            }

            const res = await exec()
            expect(res.status).toBe(404)
        })

        it('should return 400 if body is not provied', async () => {
            exec = () => {
                return request(server)
                    .patch(`/api/users/${newUser._id}`)
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

        it('should return 400 if unknow properties is present', async () => {
            user_body.test = 'test'

            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 400 if the attribute types diferent than expected', async () => {
            user_body = {
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
            user_body = {
                full_name: "test",
                email: "test",
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
                "\"email\" with value \"test\" fails to match the required pattern: /^(([^<>()[\\]\\\\.,;:\\s@\\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\\"]+)*)|(\\\".+\\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/",
                "\"password\" length must be at least 4 characters long"
            ])
        })

        it('should return 400 if attributes are empty', async () => {
            user_body = {
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
                "\"password\" length must be at least 4 characters long",
                "\"role\" is not allowed to be empty",
                "\"role\" must be one of [admin, user]",
                "\"company\" is not allowed to be empty",
                "\"company\" with value \"\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/"
            ])
        })

        it('should return 400 if large number of characters is provied', async () => {
            user_body.full_name = 'test useruhuuhuhuhuhuhuuuuuuhuhuuhuhuhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh'
            user_body.email = 'test@test.comkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk'
            user_body.role = 'adminasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasd'

            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"full_name\" length must be less than or equal to 255 characters long",
                "\"email\" length must be less than or equal to 255 characters long",
                "\"role\" must be one of [admin, user]"
            ])
        })

        it('should return 400 if invalid company id is provied', async () => {
            user_body.company = '5bf6e775909f16352f1f3b6daa'

            const res = await exec()
            expect(res.status).toBe(400)
            expect(res.type).toBe('application/json')
            expect(res.body).toEqual([
                "\"company\" with value \"5bf6e775909f16352f1f3b6daa\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/"
            ])            
        })
    })

    describe('DELETE: /api/users/:id', () => {

        exec = () => {
            return request(server)
            .delete(`/api/users/${newUser._id}`)
            .set('Authorization', token)
        } 
  
        it('should return 200 if deleted with success', async () => {
            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Delete successfully')
        })

        it('should return 400 if deleted type nonexistent', async () => {
            await exec()
            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('Invalid user')
        })

        it('should return 404 if url invalid is provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/usersss/${newUser._id}`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid id is provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/users/aa`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if id is not provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/users/`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })
    })
})