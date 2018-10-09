const mongoose = require('mongoose')
// const config = require('config')
// const { Company } = require('./companies.model')

describe('Company unit test', () => {
    describe('validate_object_id', () => {
        it('should validate a object_id', () => {
            const obj_id = mongoose.Types.ObjectId()
            const result = mongoose.Types.ObjectId.isValid(obj_id)
            expect(result).toBe(true)
        })
    })
})