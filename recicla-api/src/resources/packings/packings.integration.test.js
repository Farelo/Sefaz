const request = require('supertest')
const mongoose = require('mongoose')

describe('api/packings', () => {
    let server
    beforeEach(async () => {
        server = require('../../server')

        // company_id = mongoose.Types.ObjectId()
        // newCompany = new Company({ _id: company_id, name: 'CEBRACE TESTE' })
        // await newCompany.save()

        // const user = {
        //     full_name: 'Teste Man',
        //     email: "serginho@gmail.com",
        //     password: "qwerty123",
        //     role: 'admin',
        //     company: {
        //         _id: newCompany._id,
        //         name: newCompany.name
        //     }
        // }

        // const newUser = new User(user)
        // token = newUser.generateUserToken()
    })

    afterEach(async () => {
        await server.close()
        // await User.deleteMany({})
        // await Company.deleteMany({})
    })

    describe('AUTH MIDDLEWARE', () => {
        it('teste', async () => {
            expect(true).toBe(true)
        })
    })

})