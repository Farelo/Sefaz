const mongoose = require('mongoose')
const { Family } = require('./families.model')

describe('Family unit test', () => {
    // beforeEach(async () => {
    //     family_id = mongoose.Types.ObjectId()
    //     const new_family = new Family({ _id: family_id, code: 'LTR6' })
    //     await new_family.save()
    // })
    // afterEach(async () => {
    //     await Family.deleteMany({})
    // })

    describe('validate_object_id', () => {
        test('should validate a object_id if is an invalid _id', () => {
            const obj_id = 'invalid_id'
            const result = mongoose.Types.ObjectId.isValid(obj_id)
            expect(result).toBe(false)
        })
        test('should validate a object_id if is a valid _id', () => {
            const obj_id = mongoose.Types.ObjectId()
            const result = mongoose.Types.ObjectId.isValid(obj_id)
            expect(result).toBe(true)
        })
    })

    // describe('findByCode', () => {
    //     test('should find a family by code', async () => {

    //         setTimeout(async () => {
    //             const family = await Family.findByCode('LTR6')

    //             expect(family.code).toBe('LTR6')
    //         }, 1000)
    //     })
    // })

})