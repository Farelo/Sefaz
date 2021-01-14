const request = require('supertest')
const mongoose = require('mongoose')
const { Company } = require('../companies/companies.model')
const { User } = require('../users/users.model')
const { DeviceData } = require('./device_data.model')
const { Packing } = require('../packings/packings.model')
const { Family } = require('../families/families.model')

describe('api/device_data', () => {

    let server
    let new_company
    let new_user
    let token
    let device_data_body
    let new_packing

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
        
        new_family = await Family.create({ code: 'Family1', company: new_company._id })

        new_packing = await Packing.create( { tag: {code: '1234567'}, serial: 'SERIAL', family: new_family._id, current_state: 'analise' })

        device_data_body = { 
            device_id: '1234567', 
            message_date: new Date('2018-11-01T00:00:00'),
            message_date_timestamp: 123456789,
            last_communication: new Date('2018-11-01T00:00:00'),
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
        await Packing.deleteMany({})
        await Family.deleteMany({})
    })

    // describe('GET: /api/device_data/data', () => {

    //     beforeEach(async () => {

    //         //company ja criada no topo do script { name: 'CEBRACE TESTE' }
    //         //family ja criada no topo do script{ code: 'Family1', company: new_company._id }
    //         const family2 = await Family.create({ code: 'Family2', company: new_company._id })

    //         const packing1 = await Packing.create( { tag: {code: '9000001'}, serial: 'SERIAL', family: new_family._id, current_state: 'analise' })
    //         const packing2 = await Packing.create( { tag: {code: '9000002'}, serial: 'SERIAL', family: new_family._id, current_state: 'analise' })
    //         const packing3 = await Packing.create( { tag: {code: '9000003'}, serial: 'SERIAL', family: new_family._id, current_state: 'analise' })
    //         const packing4 = await Packing.create( { tag: {code: '9000004'}, serial: 'SERIAL', family: new_family._id, current_state: 'analise' })
    //         const packing5 = await Packing.create( { tag: {code: '9000005'}, serial: 'SERIAL', family: new_family._id, current_state: 'analise' })
    //         const packing6 = await Packing.create( { tag: {code: '8999991'}, serial: '001', family: new_family._id, current_state: 'analise' })
    //         const packing7 = await Packing.create( { tag: {code: '8999992'}, serial: '002', family: new_family._id, current_state: 'analise' })
    //         const packing8 = await Packing.create( { tag: {code: '8999993'}, serial: '001', family: family2._id,    current_state: 'analise' })

    //         const device_data1 = await DeviceData.create( { device_id: '9000001', message_date: new Date('2018-11-09T00:00:00'), message_date_timestamp: 123456789 } )
    //         const device_data2 = await DeviceData.create( { device_id: '9000002', message_date: new Date('2018-06-15T00:00:00'), message_date_timestamp: 123456789 } )
    //         const device_data3 = await DeviceData.create( { device_id: '9000003', message_date: new Date('2018-07-01T00:00:00'), message_date_timestamp: 123456789 } )
    //         const device_data4 = await DeviceData.create( { device_id: '9000004', message_date: new Date('2018-08-01T00:00:00'), message_date_timestamp: 123456789 } )
    //         const device_data5 = await DeviceData.create( { device_id: '9000004', message_date: new Date('2018-09-21T00:00:00'), message_date_timestamp: 123456789 } )
    //         const device_data6 = await DeviceData.create( { device_id: '8999991', message_date: new Date('2018-10-25T00:00:00'), message_date_timestamp: 123456789 } )
    //         const device_data7 = await DeviceData.create( { device_id: '8999992', message_date: new Date('2018-11-15T00:00:00'), message_date_timestamp: 123456789 } )
    //         const device_data8 = await DeviceData.create( { device_id: '8999993', message_date: new Date('2018-12-05T00:00:00'), message_date_timestamp: 123456789 } )
            
    //     })

    //     describe('Testing call to the rout by company_id', () => {

    //         it('should return all 9 packings belonging to the same company and filled with their last_device_data ', async () =>{

    //             const company = await Company.findOne({"name": "CEBRACE TESTE"})

    //             const res = await request(server)
    //                 .get(`/api/device_data/data?company_id=${company._id}`)
    //                 .set('Authorization', token)

    //             expect(res.status).toBe(200)
    //             expect(res.body.length).toBe(9)
    //             expect(res.body.every(packing => {

    //                 switch(packing.tag.code) {
    //                     case "1234567":
    //                         return !packing.hasOwnProperty('last_device_data')
    //                     case "9000005":
    //                         return !packing.hasOwnProperty('last_device_data')
    //                     default:
    //                         if (packing.hasOwnProperty('last_device_data')) {

    //                             const message_date = packing.last_device_data.message_date

    //                             switch(packing.tag.code) {
    //                                 case "9000001":
    //                                     return message_date == new Date('2018-11-09T00:00:00').toISOString()
    //                                 case "9000002":
    //                                     return message_date == new Date('2018-06-15T00:00:00').toISOString()
    //                                 case "9000003":
    //                                     return message_date == new Date('2018-07-01T00:00:00').toISOString()
    //                                 case "9000004": //deve trazer a data mais recente - e traz
    //                                     return message_date == new Date('2018-09-21T00:00:00').toISOString()
    //                                 case "8999991":
    //                                     return message_date == new Date('2018-10-25T00:00:00').toISOString()
    //                                 case "8999992":
    //                                     return message_date == new Date('2018-11-15T00:00:00').toISOString()
    //                                 case "8999993":
    //                                     return message_date == new Date('2018-12-05T00:00:00').toISOString()
    //                             }
    //                         }
    //                         return false
    //                 }
    //             })).toBeTruthy()
    //         })

    //     })

    //     // describe('Testing call to the route by packing_id', () => {

    //     //     it('should return one packing filled with its last_device_data', async () =>{
    //     //         const packing = await Packing.findOne({"tag.code": "9000001"})

    //     //         const res = await request(server)
    //     //             .get(`/api/device_data/data/${packing.tag.code}`)
    //     //             .set('Authorization', token)

    //     //         expect(res.status).toBe(200)
    //     //         expect(res.body.device_id).toEqual("9000001")
    //     //         expect(res.body.message_date).toEqual(new Date('2018-11-09T00:00:00').toISOString())
    //     //     })
    //     // })

    //     describe('Testing call to the route by packing_serial', () => {

    //         it('should return all packings filled with its last_device_data', async () =>{

    //             const packing_serial = '001'

    //             const res = await request(server)
    //                 .get(`/api/device_data/data?packing_serial=${packing_serial}`)
    //                 .set('Authorization', token)

    //             expect(res.status).toBe(200)
    //             expect(res.body.length).toBe(2)
    //             expect(res.body.every(packing => packing.serial == '001')).toBeTruthy()
    //             expect(res.body.every(packing => {
    //                 const message_date = packing.last_device_data.message_date

    //                 switch(packing.tag.code) {
    //                     case "8999991":
    //                         return message_date == new Date('2018-10-25T00:00:00').toISOString()
    //                     case "8999993":
    //                         return message_date == new Date('2018-12-05T00:00:00').toISOString()
    //                 }
    //             })).toBeTruthy()

    //         })

    //     })

    //     describe('Testing call to the route without query-string', () => {

    //         it('should return all 9 packings filled with their last_device_data, when it exists', async () =>{

    //             const res = await request(server)
    //                 .get(`/api/device_data/data`)
    //                 .set('Authorization', token)

    //             expect(res.status).toBe(200)
    //             expect(res.body.length).toBe(9)
    //             expect(res.body.every(packing => {

    //                 switch(packing.tag.code) {
    //                     case "1234567":
    //                         return !packing.hasOwnProperty('last_device_data')
    //                     case "9000005":
    //                         return !packing.hasOwnProperty('last_device_data')
    //                     default:
    //                         if (packing.hasOwnProperty('last_device_data')) {

    //                             const message_date = packing.last_device_data.message_date

    //                             switch(packing.tag.code) {
    //                                 case "9000001":
    //                                     return message_date == new Date('2018-11-09T00:00:00').toISOString()
    //                                 case "9000002":
    //                                     return message_date == new Date('2018-06-15T00:00:00').toISOString()
    //                                 case "9000003":
    //                                     return message_date == new Date('2018-07-01T00:00:00').toISOString()
    //                                 case "9000004": //deve trazer a data mais recente - e traz
    //                                     return message_date == new Date('2018-09-21T00:00:00').toISOString()
    //                                 case "8999991":
    //                                     return message_date == new Date('2018-10-25T00:00:00').toISOString()
    //                                 case "8999992":
    //                                     return message_date == new Date('2018-11-15T00:00:00').toISOString()
    //                                 case "8999993":
    //                                     return message_date == new Date('2018-12-05T00:00:00').toISOString()
    //                             }
    //                         }
    //                         return false
    //                 }
    //             })).toBeTruthy()
    //         })
    //     })

    //     afterEach(async () => {
    //         await Family.deleteMany({})
    //         await Packing.deleteMany({})
    //     })

        
    // })

    describe('GET: /api/device_data/data/:id', () => {

        beforeEach(async () => {

            await Packing.create( { tag: {code: '5045499'}, serial: 'SERIAL', family: new_family._id, current_state: 'analise' })
            await Packing.create( { tag: {code: '9999999'}, serial: 'SERIAL', family: new_family._id, current_state: 'analise' })

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
            const device_id = '5045499'
            
            const res = await request(server)
                .get(`/api/device_data/data/${device_id}`)
                .set('Authorization', token)
                      
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
            expect(res.body.every(dd => dd.device_id == '5045499')).toBeTruthy()
        })

        it('should return empty device_data from invalid device 9999999', async () => {
            const device_id = '9999999'

            const res = await request(server)
                .get(`/api/device_data/data/${device_id}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(0)
        })

        it('should return all device_data from device 5045499 filtered by startDate without endDate', async () => {
            const device_id = '5045499'
            const start_date = '2018-11-01 00:00:00'
        
            const res = await request(server)
                // .get(`/api/device_data/${deviceId}?startDate=2018-11-01%2000%3A00%3A00`)
                .get(`/api/device_data/data/${device_id}?start_date=${start_date}`)
                .set('Authorization', token)
  
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
        })

        it('should return all device_data from device 5045499 filtered by endDate without startDate', async () => {
            const device_id = '5045499'
            const end_date = '2018-11-16 00:00:00'

            const res = await request(server)
                .get(`/api/device_data/data/${device_id}?end_date=${end_date}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
        })

        it('should return 2 device_data from device 5045499 filtered by startDate without endDate', async () => {
            const device_id = '5045499'
            const start_date = '2018-11-06 00:00:00'
        
            const res = await request(server)
                // .get(`/api/device_data/${device_id}?startDate=2018-11-01%2000%3A00%3A00`)
                .get(`/api/device_data/data/${device_id}?start_date=${start_date}`)
                .set('Authorization', token)
  
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
        })

        it('should return 1 device_data from device 5045499 filtered by endDate without startDate', async () => {
            const device_id = '5045499'
            const end_date = '2018-11-06 00:00:00'

            const res = await request(server)
                .get(`/api/device_data/data/${device_id}?end_date=${end_date}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(1)
        })

        it('should return two device_data from device 5045499 filtered by startDate and endDate', async () => {
            const device_id = '5045499'
            const start_date = '2018-11-06 06:06:06'
            const end_date = '2018-11-07 07:07:07'

            const res = await request(server)
                .get(`/api/device_data/data/${device_id}?start_date=${start_date}&end_date=${end_date}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)

        })

        it('should return empty device_data from device 5045499 filtered by out of range Dates', async () => {
            const device_id = '5045499'
            const start_date = '2018-11-10 00:00:00'
            const end_date = '2018-11-16 00:00:00'

            const res = await request(server)
                .get(`/api/device_data/data/${device_id}?start_date=${start_date}&end_date=${end_date}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(0)
        })

        it('should return one device_data from device 5045499 filtered by dateStart and endDate', async () => {
            const device_id = '5045499'
            const start_date = '2018-11-06T06:06:06'
            const end_date = '2018-11-06T06:06:06'

            const res = await request(server)
                .get(`/api/device_data/data/${device_id}?start_date=${start_date}&end_date=${end_date}`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(1)
        })

        it('should return one device_data from device 5045499 filtered by max = 1', async () => {

            const device_id = '5045499'

            const res = await request(server)
                .get(`/api/device_data/data/${device_id}?max=1`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(1)
        })

        it('should return one device_data from device 5045499 filtered by max = 1 and startDate= and endDate=', async () => {

            const device_id = '5045499'
        
            const res = await request(server)
                .get(`/api/device_data/data/${device_id}?max=1&startDate=&endDate=`)
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(1)
        })

        afterEach(async () => {
            await DeviceData.deleteMany({})
            await Packing.deleteMany({})
        })
    })

    describe('MONGOOSE TRIGGER POST_SAVE DEVICE_DATA', () => {

        // criar um novo device_data com um last_date mais antigo: nao deve alterar o last date do packing
        it('should return the same device_data._id from packing.last_device_data as the recently created', async () => {

            const new_device_data = new DeviceData(device_data_body)
            await new_device_data.save()
        
            const packing = await Packing.findByTag(device_data_body.device_id)

            const last_device_data = packing.last_device_data

            // console.log('new_device_data._id: ', new_device_data._id)
            // console.log('last_device_data ID: ', last_device_data)
            
            expect(new_device_data._id).toEqual(last_device_data)

        })

        it('should return the same device_data._id from the packing.last_device_data as the second device_data created', async () => {

            const deviceId = '1234567'

            const first_device_data = new DeviceData({ 
                device_id: deviceId, 
                message_date: new Date('2018-11-01T00:00:00'),
                message_date_timestamp: 123456789
            })
            await first_device_data.save()

            const second_device_data = new DeviceData({ 
                device_id: deviceId, 
                message_date: new Date('2018-11-15T00:00:00'),
                message_date_timestamp: 123456789
            })
            await second_device_data.save()

            const packing = await Packing.findByTag(deviceId)

            const last_device_data = packing.last_device_data

            //first_device_data._id should be differente to packing.last_device_data
            expect(first_device_data._id).not.toEqual(last_device_data)
            
            //second_device_data._id should be equal to packing.last_device_data 
            expect(second_device_data._id).toEqual(last_device_data)
        })

        it('should return the same device_data._id from the packing.last_device_data as the first device_data created', async () => { 
            const deviceId = '1234567'

            const first_device_data = new DeviceData({ 
                device_id: deviceId, 
                message_date: new Date('2018-11-10T00:00:00'),
                message_date_timestamp: 123456789
            })
            await first_device_data.save()

            const second_device_data = new DeviceData({ 
                device_id: deviceId, 
                message_date: new Date('2018-01-01T00:00:00'),
                message_date_timestamp: 123456789
            })
            await second_device_data.save()

            const packing = await Packing.findByTag(deviceId)

            const last_device_data = packing.last_device_data

            //first_device_data._id should be euqal to packing.last_device_data
            expect(first_device_data._id).toEqual(last_device_data)
            
            //second_device_data._id should be different to packing.last_device_data 
            expect(second_device_data._id).not.toEqual(last_device_data)
        })

        
        it('should return the same device_data._id from the packing.last_device_data_battery as the recently device_data created', async () => {

            const new_device_data = new DeviceData(device_data_body)
            await new_device_data.save()
        
            const tag = {code: device_data_body.device_id}

            const packing = await Packing.findOne({ 'tag.code': tag.code }).populate('last_device_data_battery')

            expect(new_device_data._id).toEqual(packing.last_device_data_battery._id)
            expect(new_device_data.battery.percentage).toEqual(packing.last_device_data_battery.battery.percentage)
            expect(new_device_data.battery.voltage).toEqual(packing.last_device_data_battery.battery.voltage)
        })

        it('should keep the oldest device_data._id from the packing.last_device_data_battery if the recently device_data does not contain battery data', async () => {

            const new_device_data = new DeviceData(device_data_body)
            await new_device_data.save()
            
            // adicionar um segundo device_data forcará a execução do post save
            // como este segundo device data nao tem info de bateria, então o last_device_data_battery do packing deve permanecer com o id do device_data anterior
            const second_device_data = new DeviceData({ 
                device_id: '1234567', 
                message_date: new Date('2018-12-31T00:00:00'),
                message_date_timestamp: 123456789
            })
            await second_device_data.save()
            
            const tag = {code: device_data_body.device_id}
            
            const packing = await Packing.findOne({ 'tag.code': tag.code }).populate('last_device_data_battery')
        
            expect(new_device_data._id).toEqual(packing.last_device_data_battery._id)
            expect(new_device_data.battery.percentage).toEqual(packing.last_device_data_battery.battery.percentage)
            expect(new_device_data.battery.voltage).toEqual(packing.last_device_data_battery.battery.voltage)
            expect(second_device_data._id).not.toEqual(packing.last_device_data_battery._id)

        } )

        it ('should update the packing.last_device_data_battery to the new device_data._id wich contains battery data', async () => {

            const new_device_data = new DeviceData(device_data_body)
            await new_device_data.save()
            
            // adicionar um segundo device_data forcará a execução do post save
            // como este segundo device tem info de bateria, então o last_device_data_battery do packing deverá ser atualizado com o id do segundo device_data
            const second_device_data = new DeviceData({ 
                device_id: '1234567', 
                message_date: new Date('2018-12-31T00:00:00'),
                message_date_timestamp: 123456789,
                battery: { percentage: 50, voltage: 2.7}
            })
            await second_device_data.save()

            const tag = {code: device_data_body.device_id}
            
            const packing = await Packing.findOne({ 'tag.code': tag.code }).populate('last_device_data_battery')
        
            expect(new_device_data._id).not.toEqual(packing.last_device_data_battery._id)
            expect(second_device_data._id).toEqual(packing.last_device_data_battery._id)
            expect(second_device_data.battery.percentage).toEqual(packing.last_device_data_battery.battery.percentage)
            expect(second_device_data.battery.voltage).toEqual(packing.last_device_data_battery.battery.voltage)

        })

        it('should not update the packing.last_device_data_battery to the new device_data._id wich contains battery data but is an oldest device_data', async () => {
            //testar um caso em que apesar de ter bateria, a data eh mais antiga, por isso fica a bateria antiga

            const new_device_data = new DeviceData(device_data_body)
            await new_device_data.save()
            
            // adicionar um segundo device_data forcará a execução do post save
            // apesar deste segundo device data ter info de bateria, a data dessa info de bateria é mais antiga que a info de bateria que o packing ja possui
            const second_device_data = new DeviceData({ 
                device_id: '1234567', 
                message_date: new Date('2018-01-01T00:00:00'),
                message_date_timestamp: 123456789,
                battery: { percentage: 60, voltage: 2.9}
            })
            await second_device_data.save()

            const tag = {code: device_data_body.device_id}
            
            const packing = await Packing.findOne({ 'tag.code': tag.code }).populate('last_device_data_battery')
        
            expect(new_device_data._id).toEqual(packing.last_device_data_battery._id)
            expect(second_device_data._id).not.toEqual(packing.last_device_data_battery._id)
            expect(new_device_data.battery.percentage).toEqual(packing.last_device_data_battery.battery.percentage)
            expect(new_device_data.battery.voltage).toEqual(packing.last_device_data_battery.battery.voltage)

        })

        
        it('should update the packing.last_device_data and packing_last_device_data_battery with two different device_data._id', async () => {
            //testar um caso em que o packing nao tem bateria ainda, 2 device data sao inseridos e o mais recente nao tem bateria e o mais antigo tem
            //nesse caso, o last_davice_data ficará com o mais recente e o last_device_data_battery com o mais antigo, pq tem bateria

            const first_device_data = new DeviceData({ 
                device_id: '1234567', 
                message_date: new Date('2018-12-31T00:00:00'),
                message_date_timestamp: 123456789
            })
            await first_device_data.save()

            const second_device_data = new DeviceData({ 
                device_id: '1234567', 
                message_date: new Date('2018-01-01T00:00:00'),
                message_date_timestamp: 123456789,
                battery: { percentage: 60, voltage: 2.9}
            })
            await second_device_data.save()

            const tag = {code: '1234567'}
            
            const packing = await Packing.findOne({ 'tag.code': tag.code }).populate('last_device_data_battery').populate('last_device_data')
        
            expect(first_device_data._id).toEqual(packing.last_device_data._id)
            expect(second_device_data._id).not.toEqual(packing.last_device_data._id)

            expect(second_device_data._id).toEqual(packing.last_device_data_battery._id)
            expect(first_device_data._id).not.toEqual(packing.last_device_data_battery._id)
            
            expect(second_device_data.battery.percentage).toEqual(packing.last_device_data_battery.battery.percentage)
            expect(second_device_data.battery.voltage).toEqual(packing.last_device_data_battery.battery.voltage)

        })

        afterEach(async () => {

            await DeviceData.deleteMany({})

        })
    })
})
