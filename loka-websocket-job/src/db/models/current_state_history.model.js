const mongoose = require('mongoose')
const { Packing } = require('./packings.model')

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
            'bateria_normal',
            'viagem_atrasada',
            'tempo_de_permanencia_excedido',
            'sinal',
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

const update_packing = async (current_state_history, next) => {
    try {
        if (current_state_history.type !== 'bateria_baixa' && current_state_history.type !== 'tempo_de_permanencia_excedido' && current_state_history.type !== 'ausente' ) {
            await Packing.findByIdAndUpdate(current_state_history.packing, { last_current_state_history: current_state_history._id }, { new: true })
        }
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