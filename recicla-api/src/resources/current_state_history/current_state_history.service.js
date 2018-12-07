const { CurrentStateHistory } = require('./current_state_history.model')

exports.get_all_current_state_history = async(packing_id) => {
    try {
        const data = await CurrentStateHistory.find({ packing: packing_id }).sort({ updated_at: -1 }).limit(50)
        return data
    } catch (error) {
        throw new Error(error)
    }
}
