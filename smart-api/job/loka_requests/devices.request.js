const debug = require('debug')('job:loka_requests:devices')
const request_promise = require('request-promise')

module.exports = async (token) => {
    const options = {
        method: 'POST',
        uri: 'https://loka-app.com/api/deviceList',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }

    try {
        let response = await request_promise(options)
        response = JSON.parse(response)        

        return response
    } catch (error) {
        debug('Failed to get devices from loka api.')
        throw new Error('Failed to get devices from loka api.')
    }
}
