var mongoose = require('mongoose');

var historicTagsSchema = new mongoose.Schema({
  historic : [
      {
        tag_mac: String,
        data: {type: Date, default: Date.now}
      }
  ]
});


mongoose.model('HistoricTags', historicTagsSchema);
