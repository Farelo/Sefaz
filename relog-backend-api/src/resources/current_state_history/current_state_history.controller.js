const current_state_history_service = require('./current_state_history.service')
const racks_service = require('../racks/racks.service')

exports.all = async (req, res) => {
    const rack = await racks_service.get_rack(req.params.rack_id)
    if (!rack) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid rack' })

    const current_state_history_array = await current_state_history_service.get_all_current_state_history(rack._id)

    res.json(current_state_history_array)
}