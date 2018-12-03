const request = require('supertest')
const { Company } = require('../companies/companies.model')
const { User } = require('../users/users.model')
const { Family } = require('../families/families.model')
const { Setting } = require('./settings.model')

describe('api/settings', () => {
    let server
    let token
    let new_company
    let new_user
    let new_setting
    let setting_body
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

        setting_body = {
            enable_gc16: true,
            battery_level_limit: 20,
            accuracy_limit: 100,
            job_schedule_time: 50,
            range_radius: 3000,
            clean_historic_moviments_time: 5,
            no_signal_limit_in_days: 2
        }

        new_setting = new Setting(setting_body)
        await new_setting.save()

        token = new_user.generateUserToken()
    })
    afterEach(async () => {
        await server.close()
        await Company.deleteMany({})
        await User.deleteMany({})
        await Family.deleteMany({})
    })

    describe('AUTH MIDDLEWARE', () => {
        // jest.setTimeout(30000)
        
        describe('Validate token by GET method without id', () => {
            const exec = () => {
                return request(server)
                    .get('/api/settings')
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
                    .get(`/api/settings/${new_setting._id}`)
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
                    .post('/api/settings')
                    .set('Authorization', token)
                    .send(setting_body)
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
                    .patch(`/api/settings/${new_setting._id}`)
                    .set('Authorization', token)
                    .send(setting_body)
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
                    .delete(`/api/settings/${new_setting._id}`)
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

    describe('GET: /api/settings', () => {
        it('should return all settings', async () => {
            const res = await request(server)
                .get('/api/settings')
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('enable_gc16', new_setting.enable_gc16)
            expect(res.body).toHaveProperty('battery_level_limit', new_setting.battery_level_limit)
            expect(res.body).toHaveProperty('accuracy_limit', new_setting.accuracy_limit)
            expect(res.body).toHaveProperty('job_schedule_time', new_setting.job_schedule_time)
            expect(res.body).toHaveProperty('range_radius', new_setting.range_radius)
            expect(res.body).toHaveProperty('clean_historic_moviments_time', new_setting.clean_historic_moviments_time)
            expect(res.body).toHaveProperty('no_signal_limit_in_days', new_setting.no_signal_limit_in_days)
        })
    })

    describe('PATCH: /api/settings/:id', () => {
        const exec = () => {
            return request(server)
                .patch(`/api/settings/${new_setting._id}`)
                .set('Authorization', token)
                .send({
                    enable_gc16: false,
                    battery_level_limit: 15,
                })
        }

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/settings/1`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return setting edited if is valid request', async () => {
            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.enable_gc16).toBe(false)
            expect(res.body.battery_level_limit).toBe(15)
            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'enable_gc16', 'battery_level_limit', 'accuracy_limit'])
            )
        })
    })


})