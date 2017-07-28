const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const gc16Schema = new mongoose.Schema({
      annualVolume: {type: Number, required: true},
      capacity: {type: Number, required: true},
      productiveDays: {type: Number, required: true},
      containerDays: {type: Number, required: true},
      project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
      },
      packing: {type: String, required: true},
      supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'
      },
      factoryStock: {
        days: {type: Number, required: true},
        fs: {type: Number, required: true},
        fsMax: {type: Number, required: true},
        QuantContainerfs: {type: Number, required: true},
        QuantContainerfsMax: {type: Number, required: true}
      },
      supplierStock: {
        days: {type: Number, required: true},
        ss: {type: Number, required: true},
        ssMax: {type: Number, required: true},
        QuantContainerSs: {type: Number, required: true},
        QuantContainerSsMax: {type: Number, required: true}
      },
      transportationGoing: {
        days: {type: Number, required: true},
        tg: {type: Number, required: true},
        QuantContainerTg: {type: Number, required: true}
      },
      transportantionBack: {
        days: {type: Number, required: true},
        tb: {type: Number, required: true},
        QuantContainerTb: {type: Number, required: true}
      },
      frequency: {
        days: {type: Number, required: true},
        fr: {type: Number, required: true},
        QuantTotalDays: {type: Number, required: true},
        QuantContainer: {type: Number, required: true}
      },
      secutiryFactor: {
        percentage: {type: Number, required: true},
        QuantTotalBuilt: {type: Number, required: true},
        QuantContainer: {type: Number, required: true}
      }

});

gc16Schema.plugin(mongoosePaginate);
mongoose.model('GC16', gc16Schema);
