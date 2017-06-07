var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var friendlyTagSchema = new mongoose.Schema({
  tag_mac: String
});

friendlyTagSchema.plugin(autoIncrement.plugin, {
    model: 'FriendlyTag',
    field: 'code',
    startAt: 1,
    incrementBy: 1
});

mongoose.model('FriendlyTag', friendlyTagSchema);
