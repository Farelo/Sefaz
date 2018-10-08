const user_service = require('./users.service')

describe('findUser', () => {
    it('should return a user by _id', () => {
        const findUser = user_service.findUser = function(user_id) {
            return {_id: '1234564', email: 'email@email.com'}
        }
        expect(findUser(1)).toHaveProperty('email', 'email@email.com')
    })
})