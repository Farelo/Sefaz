const current_state_history_service = require('./current_state_history.service')

exports.all = async (req, res) => {
    const packing = await packings_service.get_packing(req.params.packing_id)
    if (!packing) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid packing' })

    const current_state_history_array = await current_state_history_service.get_all_current_state_history(packing._id)

    res.json(current_state_history_array)
}