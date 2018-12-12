const request = require('supertest')
const mongoose = require('mongoose')
const { User } = require('../users/users.model')
const { Company } = require('../companies/companies.model')
const { ControlPoint } = require('../control_points/control_points.model')
const { Type } = require('../types/types.model')
const { GC16 } = require('./gc16.model')
const _ = require('lodash')

describe('api/gc16', () => {
    let server
    let token
    let new_company
    let new_user
    let new_type
    let new_control_point
    let gc16_body
    let new_gc16
    
    beforeEach(async () => {
        server = require('../../server')

        new_company = await Company.create({ name: 'CEBRACE TESTE' })
        new_user = await User.create({ full_name: 'Teste Man', email: "serginho@gmail.com", password: "qwerty123", role: 'admin', company: new_company._id })
        token = new_user.generateUserToken()

        new_type = await Type.create({name: 'Factory'})
        new_control_point = await ControlPoint.create({ name: "point test", lat: 50, lng: 50, full_address: "teste", type: new_type.id, company: new_company._id })

        gc16_body = {
            annual_volume: 10,
            capacity: 10,
            productive_days: 10,
            container_days: 10,
            control_point: new_control_point._id,
            security_factor: {
                percentage: 10,
                qty_total_build: 10,
                qty_container: 10
            },
            frequency: {
                days: 10,
                fr: 10,
                qty_total_days: 10,
                qty_container: 10
            },
            transportation_going: {
                days: 10,
                value: 10,
                qty_container: 10
            },
            transportation_back: {
                days: 10,
                value: 10,
                qty_container: 10
            },
            owner_stock: {
                days: 10,
                value: 10,
                max: 10,
                qty_container: 10,
                qty_container_max: 10
            },
            client_stock: {
                days: 10,
                value: 10,
                max: 10,
                qty_container: 10,
                qty_container_max: 10
            }
        }
        new_gc16 = await GC16.create(gc16_body)
    })
    afterEach(async () => {
        await server.close()
        await User.deleteMany({})
        await Company.deleteMany({})
        await Type.deleteMany({})
        await ControlPoint.deleteMany({})
        await GC16.deleteMany({})
    })

    describe('GET: /api/gc16', () => {
        it('should return all gc16', async () => {
            const another_control_point = new ControlPoint({ name: "point test 1", lat: 55, lng: 55, full_address: "teste1", type: new_type.id, company: new_company._id })
            await another_control_point.save()

            const gc16_body_1 = {
                annual_volume: 10,
                capacity: 10,
                productive_days: 10,
                container_days: 10,
                control_point: another_control_point._id,
                security_factor: {
                    percentage: 10,
                    qty_total_build: 10,
                    qty_container: 10
                },
                frequency: {
                    days: 10,
                    fr: 10,
                    qty_total_days: 10,
                    qty_container: 10
                },
                transportation_going: {
                    days: 10,
                    value: 10,
                    qty_container: 10
                },
                transportation_back: {
                    days: 10,
                    value: 10,
                    qty_container: 10
                },
                owner_stock: {
                    days: 10,
                    value: 10,
                    max: 10,
                    qty_container: 10,
                    qty_container_max: 10
                },
                client_stock: {
                    days: 10,
                    value: 10,
                    max: 10,
                    qty_container: 10,
                    qty_container_max: 10
                }
            }
            
            const gc16_1 = await GC16.create(gc16_body_1)

            let saveGC16 = await GC16.find({})
                .select(["-created_at", "-update_at", "-__v"])
                .populate('control_point', ['_id', 'gc16'])

            saveGC16 = JSON.parse(JSON.stringify(saveGC16))
            
            const res = await request(server)
                .get('/api/gc16')
                .set('Authorization', token)

                expect(res.status).toBe(200)
                expect(res.body.length).toBe(2)
                const body = res.body.map((e) => _.omit(e, ["__v", "created_at", "update_at", 
                    "control_point.__v", "control_point.created_at", "control_point.update_at"]))
                expect(body).toEqual(saveGC16)
        })

        it('should return 404 if invalid url is passed', async () => { 
            const res = await request(server)
                .get(`/api/gc16ss`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('GET /api/gc16/:id', () => {
        it('should return 200 a gc16 if valid id is passed', async () => {

            let body_toEqual = {
                security_factor: {
                    percentage: 10,
                    qty_total_build: 10,
                    qty_container: 10
                },
                frequency: {
                    days: 10,
                    fr: 10,
                    qty_total_days: 10,
                    qty_container: 10
                },
                transportation_going: {
                    days: 10,
                    value: 10,
                    qty_container: 10
                },
                transportation_back: {
                    days: 10,
                    value: 10,
                    qty_container: 10
                },
                owner_stock: {
                    days: 10,
                    value: 10,
                    max: 10,
                    qty_container: 10,
                    qty_container_max: 10
                },
                client_stock: {
                    days: 10,
                    value: 10,
                    max: 10,
                    qty_container: 10,
                    qty_container_max: 10
                },
                annual_volume: 10,
                capacity: 10,
                productive_days: 10,
                container_days: 10,
                _id: new_gc16._id,
                control_point: new_control_point._id
            }

            const res = await request(server)
                .get(`/api/gc16/${new_gc16._id}`)
                .set('Authorization', token)

            const body = _.omit(res.body, ["__v", "created_at", "update_at", 
            "control_point.__v", "control_point.created_at", "control_point.update_at"])    

            expect(res.status).toBe(200)
            expect(body).toEqual(JSON.parse(JSON.stringify(body_toEqual)))
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server)
                .get(`/api/gc16/1a`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid url with valid id is passed', async () => { 
            const res = await request(server)
                .get(`/api/gc16ss/${new_gc16._id}`)
                .set('Authorization', token)

            expect(res.status).toBe(404)
        })
    })

    describe('POST: /api/gc16', () => {
        
        const exec = () => {
            return request(server)
                .post('/api/gc16')
                .set('Authorization', token)
                .send(gc16_body)
        }

        it('should return 201 if gc16 is valid request', async () => {
            let body_toEqual = {
                security_factor: {
                    percentage: 10,
                    qty_total_build: 10,
                    qty_container: 10
                },
                frequency: {
                    days: 10,
                    fr: 10,
                    qty_total_days: 10,
                    qty_container: 10
                },
                transportation_going: {
                    days: 10,
                    value: 10,
                    qty_container: 10
                },
                transportation_back: {
                    days: 10,
                    value: 10,
                    qty_container: 10
                },
                owner_stock: {
                    days: 10,
                    value: 10,
                    max: 10,
                    qty_container: 10,
                    qty_container_max: 10
                },
                client_stock: {
                    days: 10,
                    value: 10,
                    max: 10,
                    qty_container: 10,
                    qty_container_max: 10
                },
                annual_volume: 10,
                capacity: 10,
                productive_days: 10,
                container_days: 10,
                control_point: new_control_point._id
            }

            body_toEqual = JSON.parse(JSON.stringify(body_toEqual))

            const res = await exec()
            const body_res = _.omit(res.body, ["_id", "__v", "created_at", "update_at"])

            expect(res.status).toBe(201)
            expect(body_res).toEqual(body_toEqual)
        })
        
        it('should return 400 if control_point is not provied', async () => {
            gc16_body.control_point = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if gc16 with control_point already exists', async () => {
            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('GC16 already exists with this control_point.')
        })

        it('should return 400 if is body is empty', async () => {
            const exec = () => {
                return request(server)
                    .post('/api/gc16')
                    .set('Authorization', token)
                    .send({})
            }

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"control_point\" is required"
            ])
        })

        it('should return 400 if is unknow key is provied', async () => {
            gc16_body.test = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 404 if invalid url is provied', async () => {
            const exec = () => {
                return request(server)
                    .post('/api/gc16ss')
                    .set('Authorization', token)
                    .send(gc16_body)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 400 if attributes values above the limits', async () => {
            gc16_body.annual_volume = 1000001
            gc16_body.capacity = 10001
            gc16_body.productive_days = 10001
            gc16_body.container_days = 10001
            gc16_body.security_factor.percentage = 10001
            gc16_body.security_factor.qty_total_build = 10001
            gc16_body.security_factor.qty_container =  10001
            gc16_body.frequency.days = 10001
            gc16_body.frequency.fr = 10001
            gc16_body.frequency.qty_total_days = 10001
            gc16_body.frequency.qty_container = 10001
            gc16_body.transportation_going.days = 10001
            gc16_body.transportation_going.value = 10001
            gc16_body.transportation_going.qty_container = 10001
            gc16_body.transportation_back.days = 10001
            gc16_body.transportation_back.value = 10001
            gc16_body.transportation_back.qty_container = 10001
            gc16_body.owner_stock.days = 10001
            gc16_body.owner_stock.value = 10001
            gc16_body.owner_stock.max = 10001
            gc16_body.owner_stock.qty_container = 10001
            gc16_body.owner_stock.qty_container_max = 10001
            gc16_body.client_stock.days = 10001
            gc16_body.client_stock.value = 10001
            gc16_body.client_stock.max = 10001
            gc16_body.client_stock.qty_container = 10001
            gc16_body.client_stock.qty_container_max = 10001

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"annual_volume\" must be less than or equal to 1000000",
                "\"capacity\" must be less than or equal to 10000",
                "\"productive_days\" must be less than or equal to 10000",
                "\"container_days\" must be less than or equal to 10000",
                "\"percentage\" must be less than or equal to 10000",
                "\"qty_total_build\" must be less than or equal to 10000",
                "\"qty_container\" must be less than or equal to 10000",
                "\"days\" must be less than or equal to 10000",
                "\"fr\" must be less than or equal to 10000",
                "\"qty_total_days\" must be less than or equal to 10000",
                "\"qty_container\" must be less than or equal to 10000",
                "\"days\" must be less than or equal to 10000",
                "\"value\" must be less than or equal to 10000",
                "\"qty_container\" must be less than or equal to 10000",
                "\"days\" must be less than or equal to 10000",
                "\"value\" must be less than or equal to 10000",
                "\"qty_container\" must be less than or equal to 10000",
                "\"days\" must be less than or equal to 10000",
                "\"value\" must be less than or equal to 10000",
                "\"max\" must be less than or equal to 10000",
                "\"qty_container\" must be less than or equal to 10000",
                "\"qty_container_max\" must be less than or equal to 10000",
                "\"days\" must be less than or equal to 10000",
                "\"value\" must be less than or equal to 10000",
                "\"max\" must be less than or equal to 10000",
                "\"qty_container\" must be less than or equal to 10000",
                "\"qty_container_max\" must be less than or equal to 10000"
            ])
        })

        it('should return 400 if attributes values below the limits', async () => {
            gc16_body.annual_volume = -1
            gc16_body.capacity = -1
            gc16_body.productive_days = -1
            gc16_body.container_days = -1
            gc16_body.security_factor.percentage = -1
            gc16_body.security_factor.qty_total_build = -1
            gc16_body.security_factor.qty_container =  -1
            gc16_body.frequency.days = -1
            gc16_body.frequency.fr = -1
            gc16_body.frequency.qty_total_days = -1
            gc16_body.frequency.qty_container = -1
            gc16_body.transportation_going.days = -1
            gc16_body.transportation_going.value = -1
            gc16_body.transportation_going.qty_container = -1
            gc16_body.transportation_back.days = -1
            gc16_body.transportation_back.value = -1
            gc16_body.transportation_back.qty_container = -1
            gc16_body.owner_stock.days = -1
            gc16_body.owner_stock.value = -1
            gc16_body.owner_stock.max = -1
            gc16_body.owner_stock.qty_container = -1
            gc16_body.owner_stock.qty_container_max = -1
            gc16_body.client_stock.days = -1
            gc16_body.client_stock.value = -1
            gc16_body.client_stock.max = -1
            gc16_body.client_stock.qty_container = -1
            gc16_body.client_stock.qty_container_max = -1

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"annual_volume\" must be larger than or equal to 0",
                "\"capacity\" must be larger than or equal to 0",
                "\"productive_days\" must be larger than or equal to 0",
                "\"container_days\" must be larger than or equal to 0",
                "\"percentage\" must be larger than or equal to 0",
                "\"qty_total_build\" must be larger than or equal to 0",
                "\"qty_container\" must be larger than or equal to 0",
                "\"days\" must be larger than or equal to 0",
                "\"fr\" must be larger than or equal to 0",
                "\"qty_total_days\" must be larger than or equal to 0",
                "\"qty_container\" must be larger than or equal to 0",
                "\"days\" must be larger than or equal to 0",
                "\"value\" must be larger than or equal to 0",
                "\"qty_container\" must be larger than or equal to 0",
                "\"days\" must be larger than or equal to 0",
                "\"qty_container\" must be larger than or equal to 0",
                "\"days\" must be larger than or equal to 0",
                "\"value\" must be larger than or equal to 0",
                "\"max\" must be larger than or equal to 0",
                "\"qty_container\" must be larger than or equal to 0",
                "\"qty_container_max\" must be larger than or equal to 0",
                "\"days\" must be larger than or equal to 0",
                "\"value\" must be larger than or equal to 0",
                "\"max\" must be larger than or equal to 0",
                "\"qty_container\" must be larger than or equal to 0",
                "\"qty_container_max\" must be larger than or equal to 0"
            ])
        })

        it('should return 400 if the attribute types diferent than expected', async () => {
            gc16_body.control_point = 11
            gc16_body.annual_volume = "asd"
            gc16_body.capacity = "asd"
            gc16_body.productive_days = "asd"
            gc16_body.container_days = "asd"
            gc16_body.security_factor.percentage = "asd"
            gc16_body.security_factor.qty_total_build = "asd"
            gc16_body.security_factor.qty_container =  "asd"
            gc16_body.frequency.days = "asd"
            gc16_body.frequency.fr = "asd"
            gc16_body.frequency.qty_total_days = "asd"
            gc16_body.frequency.qty_container = "asd"
            gc16_body.transportation_going.days = "asd"
            gc16_body.transportation_going.value = "asd"
            gc16_body.transportation_going.qty_container = "asd"
            gc16_body.transportation_back.days = "asd"
            gc16_body.transportation_back.value = "asd"
            gc16_body.transportation_back.qty_container = "asd"
            gc16_body.owner_stock.days = "asd"
            gc16_body.owner_stock.value = "asd"
            gc16_body.owner_stock.max = "asd"
            gc16_body.owner_stock.qty_container = "asd"
            gc16_body.owner_stock.qty_container_max = "asd"
            gc16_body.client_stock.days = "asd"
            gc16_body.client_stock.value = "asd"
            gc16_body.client_stock.max = "asd"
            gc16_body.client_stock.qty_container = "asd"
            gc16_body.client_stock.qty_container_max = "asd"

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"annual_volume\" must be a number",
                "\"capacity\" must be a number",
                "\"productive_days\" must be a number",
                "\"container_days\" must be a number",
                "\"control_point\" must be a string",
                "\"percentage\" must be a number",
                "\"qty_total_build\" must be a number",
                "\"qty_container\" must be a number",
                "\"days\" must be a number",
                "\"fr\" must be a number",
                "\"qty_total_days\" must be a number",
                "\"qty_container\" must be a number",
                "\"days\" must be a number",
                "\"value\" must be a number",
                "\"qty_container\" must be a number",
                "\"days\" must be a number",
                "\"value\" must be a number",
                "\"qty_container\" must be a number",
                "\"days\" must be a number",
                "\"value\" must be a number",
                "\"max\" must be a number",
                "\"qty_container\" must be a number",
                "\"qty_container_max\" must be a number",
                "\"days\" must be a number",
                "\"value\" must be a number",
                "\"max\" must be a number",
                "\"qty_container\" must be a number",
                "\"qty_container_max\" must be a number"
            ])
        })
    })

    describe('PATCH: /api/gc16/:id', () => {
        
        const exec = () => {
            return request(server)
                .patch(`/api/gc16/${new_gc16._id}`)
                .set('Authorization', token)
                .send(gc16_body)
        }
        it('should return 200 if gc16 is valid request', async () => {
            gc16_body.annual_volume = 20
            gc16_body.capacity = 20
            gc16_body.productive_days = 20
            gc16_body.container_days = 20
            gc16_body.security_factor.percentage = 20
            gc16_body.security_factor.qty_total_build = 20
            gc16_body.security_factor.qty_container =  20
            gc16_body.frequency.days = 20
            gc16_body.frequency.fr = 20
            gc16_body.frequency.qty_total_days = 20
            gc16_body.frequency.qty_container = 20
            gc16_body.transportation_going.days = 20
            gc16_body.transportation_going.value = 20
            gc16_body.transportation_going.qty_container = 20
            gc16_body.transportation_back.days = 20
            gc16_body.transportation_back.value = 20
            gc16_body.transportation_back.qty_container = 20
            gc16_body.owner_stock.days = 20
            gc16_body.owner_stock.value = 20
            gc16_body.owner_stock.max = 20
            gc16_body.owner_stock.qty_container = 20
            gc16_body.owner_stock.qty_container_max = 20
            gc16_body.client_stock.days = 20
            gc16_body.client_stock.value = 20
            gc16_body.client_stock.max = 20
            gc16_body.client_stock.qty_container = 20
            gc16_body.client_stock.qty_container_max = 20


            let body_toEqual = {
                security_factor: {
                    percentage: 20,
                    qty_total_build: 20,
                    qty_container: 20
                },
                frequency: {
                    days: 20,
                    fr: 20,
                    qty_total_days: 20,
                    qty_container: 20
                },
                transportation_going: {
                    days: 20,
                    value: 20,
                    qty_container: 20
                },
                transportation_back: {
                    days: 20,
                    value: 20,
                    qty_container: 20
                },
                owner_stock: {
                    days: 20,
                    value: 20,
                    max: 20,
                    qty_container: 20,
                    qty_container_max: 20
                },
                client_stock: {
                    days: 20,
                    value: 20,
                    max: 20,
                    qty_container: 20,
                    qty_container_max: 20
                },
                annual_volume: 20,
                capacity: 20,
                productive_days: 20,
                container_days: 20,
                control_point: new_control_point._id
            }
            body_toEqual = JSON.parse(JSON.stringify(body_toEqual))

            const res = await exec()
            const body_res = _.omit(res.body, ["_id", "__v", "created_at", "update_at"])

            expect(res.status).toBe(200)
            expect(body_res).toEqual(body_toEqual)
        })
        
        it('should return 400 if control_point is not provied', async () => {
            gc16_body.control_point = ''

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if is body is empty', async () => {
            const exec = () => {
                return request(server)
                    .patch(`/api/gc16/${new_gc16._id}`)
                    .set('Authorization', token)
                    .send({})
            }

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"control_point\" is required"
            ])
        })

        it('should return 400 if is unknow key is provied', async () => {
            gc16_body.test = 'test'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"test\" is not allowed"
            ])
        })

        it('should return 404 if invalid url is provied', async () => {
            const exec = () => {
                return request(server)
                    .patch(`/api/gc16ss/${new_gc16._id}`)
                    .set('Authorization', token)
                    .send(gc16_body)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid id is provied', async () => {
            const exec = () => {
                return request(server)
                    .patch(`/api/gc16/11a`)
                    .set('Authorization', token)
                    .send(gc16_body)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 400 if attributes values above the limits', async () => {
            gc16_body.annual_volume = 1000001
            gc16_body.capacity = 10001
            gc16_body.productive_days = 10001
            gc16_body.container_days = 10001
            gc16_body.security_factor.percentage = 10001
            gc16_body.security_factor.qty_total_build = 10001
            gc16_body.security_factor.qty_container =  10001
            gc16_body.frequency.days = 10001
            gc16_body.frequency.fr = 10001
            gc16_body.frequency.qty_total_days = 10001
            gc16_body.frequency.qty_container = 10001
            gc16_body.transportation_going.days = 10001
            gc16_body.transportation_going.value = 10001
            gc16_body.transportation_going.qty_container = 10001
            gc16_body.transportation_back.days = 10001
            gc16_body.transportation_back.value = 10001
            gc16_body.transportation_back.qty_container = 10001
            gc16_body.owner_stock.days = 10001
            gc16_body.owner_stock.value = 10001
            gc16_body.owner_stock.max = 10001
            gc16_body.owner_stock.qty_container = 10001
            gc16_body.owner_stock.qty_container_max = 10001
            gc16_body.client_stock.days = 10001
            gc16_body.client_stock.value = 10001
            gc16_body.client_stock.max = 10001
            gc16_body.client_stock.qty_container = 10001
            gc16_body.client_stock.qty_container_max = 10001

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"annual_volume\" must be less than or equal to 1000000",
                "\"capacity\" must be less than or equal to 10000",
                "\"productive_days\" must be less than or equal to 10000",
                "\"container_days\" must be less than or equal to 10000",
                "\"percentage\" must be less than or equal to 10000",
                "\"qty_total_build\" must be less than or equal to 10000",
                "\"qty_container\" must be less than or equal to 10000",
                "\"days\" must be less than or equal to 10000",
                "\"fr\" must be less than or equal to 10000",
                "\"qty_total_days\" must be less than or equal to 10000",
                "\"qty_container\" must be less than or equal to 10000",
                "\"days\" must be less than or equal to 10000",
                "\"value\" must be less than or equal to 10000",
                "\"qty_container\" must be less than or equal to 10000",
                "\"days\" must be less than or equal to 10000",
                "\"value\" must be less than or equal to 10000",
                "\"qty_container\" must be less than or equal to 10000",
                "\"days\" must be less than or equal to 10000",
                "\"value\" must be less than or equal to 10000",
                "\"max\" must be less than or equal to 10000",
                "\"qty_container\" must be less than or equal to 10000",
                "\"qty_container_max\" must be less than or equal to 10000",
                "\"days\" must be less than or equal to 10000",
                "\"value\" must be less than or equal to 10000",
                "\"max\" must be less than or equal to 10000",
                "\"qty_container\" must be less than or equal to 10000",
                "\"qty_container_max\" must be less than or equal to 10000"
            ])
        })

        it('should return 400 if attributes values below the limits', async () => {
            gc16_body.annual_volume = -1
            gc16_body.capacity = -1
            gc16_body.productive_days = -1
            gc16_body.container_days = -1
            gc16_body.security_factor.percentage = -1
            gc16_body.security_factor.qty_total_build = -1
            gc16_body.security_factor.qty_container =  -1
            gc16_body.frequency.days = -1
            gc16_body.frequency.fr = -1
            gc16_body.frequency.qty_total_days = -1
            gc16_body.frequency.qty_container = -1
            gc16_body.transportation_going.days = -1
            gc16_body.transportation_going.value = -1
            gc16_body.transportation_going.qty_container = -1
            gc16_body.transportation_back.days = -1
            gc16_body.transportation_back.value = -1
            gc16_body.transportation_back.qty_container = -1
            gc16_body.owner_stock.days = -1
            gc16_body.owner_stock.value = -1
            gc16_body.owner_stock.max = -1
            gc16_body.owner_stock.qty_container = -1
            gc16_body.owner_stock.qty_container_max = -1
            gc16_body.client_stock.days = -1
            gc16_body.client_stock.value = -1
            gc16_body.client_stock.max = -1
            gc16_body.client_stock.qty_container = -1
            gc16_body.client_stock.qty_container_max = -1

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"annual_volume\" must be larger than or equal to 0",
                "\"capacity\" must be larger than or equal to 0",
                "\"productive_days\" must be larger than or equal to 0",
                "\"container_days\" must be larger than or equal to 0",
                "\"percentage\" must be larger than or equal to 0",
                "\"qty_total_build\" must be larger than or equal to 0",
                "\"qty_container\" must be larger than or equal to 0",
                "\"days\" must be larger than or equal to 0",
                "\"fr\" must be larger than or equal to 0",
                "\"qty_total_days\" must be larger than or equal to 0",
                "\"qty_container\" must be larger than or equal to 0",
                "\"days\" must be larger than or equal to 0",
                "\"value\" must be larger than or equal to 0",
                "\"qty_container\" must be larger than or equal to 0",
                "\"days\" must be larger than or equal to 0",
                "\"qty_container\" must be larger than or equal to 0",
                "\"days\" must be larger than or equal to 0",
                "\"value\" must be larger than or equal to 0",
                "\"max\" must be larger than or equal to 0",
                "\"qty_container\" must be larger than or equal to 0",
                "\"qty_container_max\" must be larger than or equal to 0",
                "\"days\" must be larger than or equal to 0",
                "\"value\" must be larger than or equal to 0",
                "\"max\" must be larger than or equal to 0",
                "\"qty_container\" must be larger than or equal to 0",
                "\"qty_container_max\" must be larger than or equal to 0"
            ])
        })

        it('should return 400 if the attribute types diferent than expected', async () => {
            gc16_body.control_point = 11
            gc16_body.annual_volume = "asd"
            gc16_body.capacity = "asd"
            gc16_body.productive_days = "asd"
            gc16_body.container_days = "asd"
            gc16_body.security_factor.percentage = "asd"
            gc16_body.security_factor.qty_total_build = "asd"
            gc16_body.security_factor.qty_container =  "asd"
            gc16_body.frequency.days = "asd"
            gc16_body.frequency.fr = "asd"
            gc16_body.frequency.qty_total_days = "asd"
            gc16_body.frequency.qty_container = "asd"
            gc16_body.transportation_going.days = "asd"
            gc16_body.transportation_going.value = "asd"
            gc16_body.transportation_going.qty_container = "asd"
            gc16_body.transportation_back.days = "asd"
            gc16_body.transportation_back.value = "asd"
            gc16_body.transportation_back.qty_container = "asd"
            gc16_body.owner_stock.days = "asd"
            gc16_body.owner_stock.value = "asd"
            gc16_body.owner_stock.max = "asd"
            gc16_body.owner_stock.qty_container = "asd"
            gc16_body.owner_stock.qty_container_max = "asd"
            gc16_body.client_stock.days = "asd"
            gc16_body.client_stock.value = "asd"
            gc16_body.client_stock.max = "asd"
            gc16_body.client_stock.qty_container = "asd"
            gc16_body.client_stock.qty_container_max = "asd"

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toEqual([
                "\"annual_volume\" must be a number",
                "\"capacity\" must be a number",
                "\"productive_days\" must be a number",
                "\"container_days\" must be a number",
                "\"control_point\" must be a string",
                "\"percentage\" must be a number",
                "\"qty_total_build\" must be a number",
                "\"qty_container\" must be a number",
                "\"days\" must be a number",
                "\"fr\" must be a number",
                "\"qty_total_days\" must be a number",
                "\"qty_container\" must be a number",
                "\"days\" must be a number",
                "\"value\" must be a number",
                "\"qty_container\" must be a number",
                "\"days\" must be a number",
                "\"value\" must be a number",
                "\"qty_container\" must be a number",
                "\"days\" must be a number",
                "\"value\" must be a number",
                "\"max\" must be a number",
                "\"qty_container\" must be a number",
                "\"qty_container_max\" must be a number",
                "\"days\" must be a number",
                "\"value\" must be a number",
                "\"max\" must be a number",
                "\"qty_container\" must be a number",
                "\"qty_container_max\" must be a number"
            ])
        })
    })

    describe('DELETE: /api/control_points/:id', () => {
        
        exec = () => {
            return request(server)
                .delete(`/api/gc16/${new_gc16._id}`)
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
            expect(res.body.message).toBe('Invalid gc16')
        })

        it('should return 404 if url invalid is provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/gc16ss/${new_gc16._id}`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid id is provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/gc16/aa`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if id is not provied', async () => {
            exec = () => {
                return request(server)
                    .delete(`/api/gc16/`)
                    .set('Authorization', token)
            }

            const res = await exec()

            expect(res.status).toBe(404)
        })
    })
})
