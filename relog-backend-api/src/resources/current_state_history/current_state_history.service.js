const { CurrentStateHistory } = require('./current_state_history.model')

exports.get_all_current_state_history = async(rack_id) => {
    try {
        const data = await CurrentStateHistory.find({ rack: rack_id }).sort({ updated_at: -1 }).limit(50)
        return data
    } catch (error) {
        throw new Error(error)
    }
}
