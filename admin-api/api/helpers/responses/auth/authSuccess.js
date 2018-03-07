"use strict";

const jwt                 = require('jsonwebtoken');
const HttpStatus          = require("http-status");
const hashPassword        = require('../../utils/encrypt')
const environment         = require('../../../../config/environment')

function authSuccess(res, credentials, data) {
    console.log(data)
    console.log(credentials)
    let user = data;
    const isMatch = (credentials.password == user.password);

    if (isMatch) {
        var payload = { id: user._id };
        res.status(HttpStatus.OK).json({ jsonapi: { "version": "1.0" }, token: `JWT ${jwt.sign(payload, environment.secret, { expiresIn: environment.expiresIn })}` , data: user});
    }
    else {
        res.status(HttpStatus.UNAUTHORIZED).json({ jsonapi: { "version": "1.0" }, UNAUTHORIZED: 'The credentials are invalid!' });
    }
}

module.exports = authSuccess;
