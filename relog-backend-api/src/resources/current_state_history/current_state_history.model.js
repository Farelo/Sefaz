const debug = require('debug')('model:currentStateHistory')
const mongoose = require('mongoose')
const { Rack } = require('../racks/racks.model')

const currentStateHistorySchema = new mongoose.Schema({
    rack: {
        type: mongoose.Schema.ObjectId,
        ref: 'Rack',
        required: true
    },
    type: {
        type: String,
        enum: [
            'viagem_perdida',
            'local_incorreto',
            'bateria_baixa',
            'viagem_atrasada',
            'tempo_de_permanencia_excedido',
            'sem_sinal',
            'perdida',
            'desabilitada_com_sinal',
            'desabilitada_sem_sinal',
            'analise',
            'ausente',
            'viagem_em_prazo',
            'local_correto'
        ],
        lowercase: true,
        trim: true,
        required: true
    },
    device_data_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'DeviceData',
    },
    created_at: {
        type: Date,
        default: Date.now

    },
    update_at: {
        type: Date,
        default: Date.now
    }
})

const update_rack = async (current_state_history, next) => {
    try {
        await Rack.findByIdAndUpdate(current_state_history.rack, { last_current_state_history: current_state_history._id }, { new: true })
        next()
    } catch (error) {
        next(error)
    }
}

currentStateHistorySchema.statics.findByRack = function (rack_id, projection = '') {
    return this
        .find({ rack: rack_id }, projection)
        .sort({ created_at: -1 })
}

const saveCurrentStateHistoryToRack = function (doc, next) {
    update_rack(doc, next)
}

const update_updated_at_middleware = function (next) {
    let update = this.getUpdate()
    update.update_at = new Date()
    next()
}

currentStateHistorySchema.post('save', saveCurrentStateHistoryToRack)
currentStateHistorySchema.pre('update', update_updated_at_middleware)
currentStateHistorySchema.pre('findOneAndUpdate', update_updated_at_middleware)

const CurrentStateHistory = mongoose.model('CurrentStateHistory', currentStateHistorySchema)

exports.CurrentStateHistory = CurrentStateHistory
exports.currentStateHistorySchema = currentStateHistorySchema