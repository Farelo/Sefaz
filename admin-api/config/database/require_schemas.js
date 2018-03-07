'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const ObjectId = mongoose.Types.ObjectId;

/*
* modulos que serão exportados para o sistema
*/
module.exports = {
    user: user, //retorna o schema de alertas
    ObjectId: ObjectId //cria um tipo  ObjectId,
}

//retorna o schema de alertas
function user() {
    return mongoose.model('User');
}
