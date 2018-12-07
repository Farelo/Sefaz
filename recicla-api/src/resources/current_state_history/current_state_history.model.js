const debug = require('debug')('model:currentStateHistory')
const mongoose = require('mongoose')
const { Packing } = require('../packings/packings.model')

const currentStateHistorySchema = new mongoose.Schema({
    packing: {
        type: mongoose.Schema.ObjectId,
        ref: 'Packing',
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
            'viagem_em_prazo',
            'local_correto'
        ],
        lowercase: true,
        trim: true,
        required: true
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

const update_packing = async (current_state_history, next) => {
    try {
        await Packing.findByIdAndUpdate(current_state_history.packing, { last_current_state_history: current_state_history._id }, { new: true })
        next()
    } catch (error) {
        next(error)
    }
}

currentStateHistorySchema.statics.findByPacking = function (packing_id, projection = '') {
    return this
        .find({ packing: packing_id }, projection)
        .sort({ created_at: -1 })
}

const saveCurrentStateHistoryToPacking = function (doc, next) {
    update_packing(doc, next)
}

const update_updated_at_middleware = function (next) {
    let update = this.getUpdate()
    update.update_at = new Date()
    next()
}

currentStateHistorySchema.post('save', saveCurrentStateHistoryToPacking)
currentStateHistorySchema.pre('update', update_updated_at_middleware)
currentStateHistorySchema.pre('findOneAndUpdate', update_updated_at_middleware)

const CurrentStateHistory = mongoose.model('CurrentStateHistory', currentStateHistorySchema)

exports.CurrentStateHistory = CurrentStateHistory
exports.currentStateHistorySchema = currentStateHistorySchema