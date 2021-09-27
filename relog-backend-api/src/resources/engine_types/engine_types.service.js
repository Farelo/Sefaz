const debug = require('debug')('service:engine_types')
const _ = require('lodash')
const { EngineType } = require('./engine_types.model')
const { Route } = require('../routes/routes.model')





exports.get_engine_types = async (code) => {
    try {
        if (!code) return await EngineType.find()

        const data = await EngineType.findByCode(code)
        return data ? [data] : []
    } catch (error) {
        throw new Error(error);
    }
}

exports.get_engine_type = async (id) => {
    try {
        const engine_type = await EngineType
            .findById(id)
        return engine_type
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_code = async (code) => {
    try {
        const engine_type = await EngineType.findByCode(code)
        return engine_type
    } catch (error) {
        throw new Error(error)
    }
}

exports.create_engine_type = async (engine_type) => {
    try {
        const new_engine_type = new EngineType(engine_type)
        await new_engine_type.save()
        return new_engine_type
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_id = async (id) => {
    try {
        const engine_type = await EngineType.findById(id);
        return engine_type
    } catch (error) {
        throw new Error(error)
    }
}

exports.update_engine_type = async (id, engine_type_edited) => {
    try {
        const options = { runValidators: true, new: true }
        const engine_type = await EngineType.findByIdAndUpdate(id, engine_type_edited, options)

        return engine_type
    } catch (error) {
        throw new Error(error)
    }
}
try{
EngineType.insertMany([
    
    //D08 4 cilindros
    {code: '2S2100015CF', observations: 'D08 - 4 cilindros'},
    {code: '2T2100015KG', observations: 'D08 - 4 cilindros'},
    {code: '2T2100015KJ', observations: 'D08 - 4 cilindros'},
    {code: '2T2100015KK', observations: 'D08 - 4 cilindros'},
    {code: '2T2100015MP', observations: 'D08 - 4 cilindros'},
    {code: '2W0100015DF', observations: 'D08 - 4 cilindros'},
    {code: '2W0100015DG', observations: 'D08 - 4 cilindros'},
    {code: '2W0100015EQ', observations: 'D08 - 4 cilindros'},
    {code: '2W0100015DH', observations: 'D08 - 4 cilindros'},
    {code: '2W0100015DJ', observations: 'D08 - 4 cilindros'},
    {code: '2W0100015DK', observations: 'D08 - 4 cilindros'},
    {code: '2W0100015DL', observations: 'D08 - 4 cilindros'},
    {code: 'FPP100015AF', observations: 'D08 - 4 cilindros'},
    {code: 'FPP100015AH', observations: 'D08 - 4 cilindros'},
    {code: 'FPP100015AJ', observations: 'D08 - 4 cilindros'},
    {code: 'FPP100015AI', observations: 'D08 - 4 cilindros'},
    {code: 'FPP100015AM', observations: 'D08 - 4 cilindros'},
    {code: 'FPP100015AX', observations: 'D08 - 4 cilindros'},
    {code: 'FPP100015AW', observations: 'D08 - 4 cilindros'},

    //D08 - 6 CILINDROS
    {code: '2T2100015LA', observations: 'D08 - 6 cilindros'},
    {code: '2T2100015LB', observations: 'D08 - 6 cilindros'},
    {code: '2T2100015LC', observations: 'D08 - 6 cilindros'},
    {code: '2T2100015LE', observations: 'D08 - 6 cilindros'},
    {code: '2T2100015LG', observations: 'D08 - 6 cilindros'},
    {code: '2T2100015LH', observations: 'D08 - 6 cilindros'},
    {code: '2T2100015KQ', observations: 'D08 - 6 cilindros'},
    {code: '2T2100015KR', observations: 'D08 - 6 cilindros'},
    {code: '2T2100015KS', observations: 'D08 - 6 cilindros'},
    {code: '2T2100015KT', observations: 'D08 - 6 cilindros'},
    {code: '2T2100015ME', observations: 'D08 - 6 cilindros'},
    {code: '2T2100015NQ', observations: 'D08 - 6 cilindros'},
    {code: '2T2100015NR', observations: 'D08 - 6 cilindros'},
    {code: '2T2100015NT', observations: 'D08 - 6 cilindros'},
    {code: '2Z0100015FA', observations: 'D08 - 6 cilindros'},
    {code: '2Z0100015FB', observations: 'D08 - 6 cilindros'},
    {code: '2W0100015DM', observations: 'D08 - 6 cilindros'},
    {code: '2W0100015DN', observations: 'D08 - 6 cilindros'},
    {code: '2W0100015DQ', observations: 'D08 - 6 cilindros'},
    {code: '2W0100015DR', observations: 'D08 - 6 cilindros'},
    {code: '2W0100015DS', observations: 'D08 - 6 cilindros'},
    {code: '2Z0100015FC', observations: 'D08 - 6 cilindros'},
    {code: '2Z0100015FE', observations: 'D08 - 6 cilindros'},
    {code: '2Z0100015FF', observations: 'D08 - 6 cilindros'},
    {code: '2Z0100015JL', observations: 'D08 - 6 cilindros'},
    {code: '2Z0100015JM', observations: 'D08 - 6 cilindros'},
    {code: '2Z0100015JN', observations: 'D08 - 6 cilindros'},
    {code: '22B100015AA', observations: 'D08 - 6 cilindros'},
    {code: '22B100015AP', observations: 'D08 - 6 cilindros'},
    {code: '22B100015AR', observations: 'D08 - 6 cilindros'},
    {code: '22B100015AS', observations: 'D08 - 6 cilindros'},
    {code: '22B100015BB', observations: 'D08 - 6 cilindros'},
    {code: '22B100015BC', observations: 'D08 - 6 cilindros'},
    {code: 'FPP100015BA', observations: 'D08 - 6 cilindros'},
    {code: 'FPP100015BB', observations: 'D08 - 6 cilindros'},
    {code: 'PRH100015J', observations: 'D08 - 6 cilindros'},
    {code: 'PRH100015L', observations: 'D08 - 6 cilindros'},
    {code: 'PRH100015M', observations: 'D08 - 6 cilindros'},
    {code: 'PRH100015N', observations: 'D08 - 6 cilindros'},
    {code: 'PRH100015P', observations: 'D08 - 6 cilindros'},
    {code: 'PRR100015A', observations: 'D08 - 6 cilindros'},
    {code: 'PRR100015B', observations: 'D08 - 6 cilindros'},

    //D26 - 6 CILINDROS
    {code: '2V3100015O', observations: 'D26 - 6 cilindros'},
    {code: '2V3100015C', observations: 'D26 - 6 cilindros'},
    {code: '2V3100015L', observations: 'D26 - 6 cilindros'},
    {code: '2V5100015F', observations: 'D26 - 6 cilindros'},
    {code: '2V3100015G', observations: 'D26 - 6 cilindros'},
    {code: '2V3100015AF', observations: 'D26 - 6 cilindros'},
    {code: '2V3100015AH', observations: 'D26 - 6 cilindros'},
    {code: '2V3100015AM', observations: 'D26 - 6 cilindros'}

], { ordered:false})
 }catch(err){
     print(err);
 } 
