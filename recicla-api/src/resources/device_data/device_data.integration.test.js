const request = require('supertest')
const mongoose = require('mongoose')
const { Company } = require('../companies/companies.model')
const { User } = require('../users/users.model')
const { DeviceData } = require('./device_data.model')

describe('api/device_data', () => {

    let server
    let new_company
    let new_user
    let token
    let device_data_body


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
        
        device_data_body = { 
            device_id: '1234567', 
            message_date: new Date('2018-12-31T00:00:00'),
            message_date_timestamp: 123456789,
            last_communication: new Date('2018-12-31T00:00:00'),
            last_communication_timestamp: 987654321,
            latitude: 1234.4321,
            longitude: 5678.8765,
            accuracy: 80,
            temperature: 27,
            seq_number: 1,
            battery: {
                percentage: 100,
                voltage: 3.11
            }
        }

        token = new_user.generateUserToken()
    })

    afterEach(async () => {
        
        await server.close()
        await Company.deleteMany({})
        await User.deleteMany({})
        await DeviceData.deleteMany({})
    })

    describe('AUTH MIDDLEWARE', () => {
        const exec = () => {
            return request(server)
                .post('/api/device_data')
                .set('Authorization', token)
                .send(device_data_body)
        }

        it('should return 401 if no token is provided', async () => {
            token = ''
            const res = await exec()
            expect(res.status).toBe(401)
        })

        it('should return 400 if token is invalid', async () => {
            token = 'h'
            const res = await exec()
            expect(res.status).toBe(400)
        })

        it('should return 201 if token is valid', async () => {
            const res = await exec()
            expect(res.status).toBe(201)
        })
    })

    describe('AUTHZ MIDDLEWARE', () => {
        const exec = async () => {
            return request(server)
                .post('/api/device_data')
                .set('Authorization', token)
                .send(device_data_body)
        }

        it('should return 403 if user is not admin', async () => {
            const another_user = await User.create({
                full_name: 'Teste Man',
                email: "miguel2@reciclapac.com",
                password: "miguel123",
                role: 'user',
                company: {
                    _id: new_company._id,
                    name: new_company.name
                }
            })

            token = another_user.generateUserToken()
            
            const res = await exec()
            expect(res.status).toBe(403)
        })

        it('should return 201 if user is admin', async () => {
            const res = await exec()
            expect(res.status).toBe(201)
        })
    })

    describe('GET: /API/DEVICE_DATA', () => {

        beforeEach(async () => {

            await DeviceData.collection.insertMany([
                { 
                    device_id: '5045499', message_date: new Date('2018-11-07T07:07:07'),
                    message_date_timestamp: 123456789, last_communication: new Date('2018-11-07T07:07:07'),
                    last_communication_timestamp: 987654321, latitude: 1234.4321, longitude: 5678.8765,
                    accuracy: 80, temperature: 27, seq_number: 1,
                    battery: { percentage: 100, voltage: 3.11 }
                },
                
                { 
                    device_id: '5045499', message_date: new Date('2018-11-06T06:06:06'),
                    message_date_timestamp: 123456789, last_communication: new Date('2018-11-06T06:06:06'),
                    last_communication_timestamp: 987654321, latitude: 4065.3196, longitude: 4500.4386,
                    accuracy: 80, temperature: 27, seq_number: 2,
                    battery: { percentage: 100, voltage: 3.11 }
                },
                
                { 
                    device_id: '5045499',  message_date: new Date('2018-11-05T05:05:05'),
                    message_date_timestamp: 543217890, last_communication: new Date('2018-11-05T05:05:05'),
                    last_communication_timestamp: 99871234, latitude: 9999.0909, longitude: 2846.1212,
                    accuracy: 32000, temperature: 25, seq_number: 3,
                    battery: { percentage: 30, voltage: 2.7 }
                },

                device_data_body = { 
                    device_id: '3055555',  message_date: new Date('2018-11-02T02:02:02'),
                    message_date_timestamp: 543217890, last_communication: new Date('2018-11-02T02:02:02'),
                    last_communication_timestamp: 89871234, latitude: 9999.0909, longitude: 2846.1212,
                    accuracy: 32000, temperature: 25, seq_number: 3,
                    battery: { percentage: 30, voltage: 2.7 }
                }
            ])
        })
        
        it('should return all device_data from device 5045499', async () => {
            const deviceId = '5045499'
            
            const res = await request(server)
                .get(`/api/device_data/${deviceId}`)
                .set('Authorization', token)
                      
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
            expect(res.body.every(dd => dd.device_id == '5045499')).toBeTruthy()
        })

        it('should return empty device_data from invalid device 9999999', async () => {
            const deviceId = '9999999'

            const res = await request(server)
                .get(`/api/device_data/${deviceId}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(0)
        })

        it('should return all device_data from device 5045499 filtered by startDate without endDate', async () => {

            const deviceId = '5045499'
        
            const res = await request(server)
                .get(`/api/device_data/${deviceId}?startDate=2018-11-01%2000%3A00%3A00`)
                .set('Authorization', token)
  
                expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
        })

        it('should return all device_data from device 5045499 filtered by endDate without startDate', async () => {
            
        })

        // it('should return two device_data from device 5045499 filtered by startDate and endDate')

        // it('should return empty device_data from device 5045499 filtered by out of range Dates')

        // it('should return one device_data from device 5045499 filtered by dateStart and endDate')

        it('should return one device_data from device 5045499 filtered by max = 1', async () => {

            const deviceId = '5045499'
        
            const res = await request(server)
                .get(`/api/device_data/${deviceId}?max=1`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(1)
        })

        it('should return one device_data from device 5045499 filtered by max = 1 and startDate= and endDate=', async () => {

            const deviceId = '5045499'
        
            const res = await request(server)
                .get(`/api/device_data/${deviceId}?max=1&startDate=&endDate=`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(1)
        })

        afterEach(async () => {
            await DeviceData.deleteMany({})
        })
    })
})
