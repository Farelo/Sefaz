"use strict";

const jwt                 = require("jwt-simple");
const HttpStatus          = require("http-status");
const hashPassword        = require('../utils/encrypt')
const environment         = require('../../../environment')

function authSuccess(res, credentials, data) {
    let user = data[0];
    const isMatch = (credentials.password == user.password);

    if (isMatch) {
        var payload = { id: user._id };

        res.status(HttpStatus.OK).json({ jsonapi: { "version": "1.0" }, token: "JWT " + jwt.encode(payload, environment.secret,'HS512') , data: user});
    }
    else {
        res.status(HttpStatus.UNAUTHORIZED).json({ jsonapi: { "version": "1.0" }, UNAUTHORIZED: 'The credentials are invalid!' });
    }
}

module.exports = authSuccess;
