'use strict';
/**
 * Module dependencies.
 */

const schemas  = require("../../../config/database/require_schemas")
const ObjectId = schemas.ObjectId

module.exports = {
    searching: searching,
    existAncestor: existAncestor,
    createObject: createObject  
}

function searching(body, result, id) {
    if (result === null) { //verifica se não encontrou nenhuma com o mesmo codigo e mesmo fornecedor no mesmo projeto
        let partial = Object.assign({}, body);
        partial.routes = [];
        delete partial.gc16;
        delete partial.actual_gc16;
        return schemas.packing().update({
            _id: id
        }, { $unset: { actual_gc16: 1, gc16: 1 }, $set: partial });
    } else if (result.gc16 && result.routes) { //verifica se encontrou uma embalagem como fornecedor e codigo no mesmo projeto e que apresenta cadastro gc16 e routas ja vinculadas
        let partial = Object.assign({}, body);
        partial.gc16 = result.gc16;
        partial.routes = result.routes;
        return schemas.packing().update({
            _id: id
        }, partial);
    } else if (result.gc16) {//verifica se encontrou uma embalagem como fornecedor e codigo no mesmo projeto e que apresenta cadastro gc16 
        let partial = Object.assign({}, body);
        partial.gc16 = result.gc16;
        partial.routes = [];
        return schemas.packing().update({
            _id: id
        }, { $set: partial });
    } else if (result.routes) {//verifica se encontrou uma embalagem como fornecedor e codigo no mesmo projeto e routas ja vinculadas
        let partial = Object.assign({}, body);
        partial.routes = result.routes;
        delete partial.gc16;
        delete partial.actual_gc16;
        return schemas.packing().update({
            _id: id
        }, { $unset: { actual_gc16: 1, gc16: 1 }, $set: partial });
    }
}


async function existAncestor(gc16, routes, p) {
    let result = await Promise.all([
        schemas.packing().find({ gc16: new ObjectId(gc16) }),
        schemas.packing().find({ routes: { $in: routes } })
    ])

    if (result[0].length === 0 && result[1].length === 0) { //caso não existe nenhum ancestral com esses dados deleta-los
        return schemas.GC16().remove({
            _id: p.gc16
        })
            .then(() => schemas.route().remove({
                _id: {
                    $in: p.routes
                }
            }));
    } else if (result[0].length === 0) { //caso nenhum ancestral senha o GC16
        return schemas.GC16().remove({
            _id: p.gc16
        });
    } else if (result[1].length === 0) { //caso nehuum ancestral tenhas as rotas passadas
        return schemas.route().remove({
            _id: {
                $in: p.routes
            }
        });
    } else {
        return schemas.packing().findOne({ _id: p._id });
    }

}

function createObject(data){
    return [
        { name: "Objetos Controlados", value: data[0] - (data[1] + data[2] + data[3] + data[4] + data[5]) },
        { name: "Objetos Perdidos", value: data[1] },
        { name: "Objetos Incorretos", value: data[2] },
        { name: "Objetos Viajando", value: data[3] },
        { name: "Tempo de Permanencia Excedido", value: data[4] },
        { name: "Objetos Atrasados", value: data[5] }
    ]
}