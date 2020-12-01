const debug = require('debug')('controller:logs')
const mongoose = require("mongoose");
const HttpStatus = require('http-status-codes')
const logs_service = require('./logs.service')
const jwt = require('jsonwebtoken')
const config = require('config');

exports.all = async (req, res) => {
    const logs = await logs_service.get_all()

    res.json(logs)
}

exports.create = async (req, res) => {

    let user;
    if(req.body != undefined){
        user = req.body.user
    }
     
    let userId = req.id;
    let log = req.log;
    let token = req.token;
    let newData = req.newData;   
    let decoded_payload;

    
    if(log == undefined){log = req.body.log}
    if(userId == undefined){userId = user}


    if( log == 'login' || log == 'logout' || log == 'invalid_password' ){
        logs = await logs_service.create_log({userId:userId,log})
    }else{

        token = token.split(' '); 
        decoded_payload = jwt.verify(token[1], config.get('security.jwtPrivateKey'))
        logs = await logs_service.create_log({userId:decoded_payload._id,log,newData})

    }
    
    //res.json({"code" : "200"})
}
