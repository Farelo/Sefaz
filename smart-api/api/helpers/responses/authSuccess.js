"use strict";

const jwt = require("jwt-simple");
const HttpStatus = require("http-status");
const bcrypt = require("bcrypt");

function authSuccess(res, credentials, data) {

    const isMatch = bcrypt.compareSync(credentials.password, data.password);

    if (isMatch) {
        var payload = { id: data.id };

        res.status(HttpStatus.OK).json({ jsonapi: { "version": "1.0" }, token: "JWT " + jwt.encode(payload, "S3CR3T3") });
    }
    else {
        res.status(HttpStatus.UNAUTHORIZED).json({ jsonapi: { "version": "1.0" }, UNAUTHORIZED: 'The credentials are invalid!' });
    }
}

module.exports = authSuccess;
