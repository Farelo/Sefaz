var mongoose = require('mongoose');

var historicTagsSchema = new mongoose.Schema({
  historic : [
      {
        tag_mac: String,
        data: {type: Date, default: Date.now}
      }
  ],
  friendly_tag: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'FriendlyTag'
  }
});


mongoose.model('HistoricTags', historicTagsSchema);
