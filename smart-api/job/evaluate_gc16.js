

module.exports = {
  changed: function (p , plant ) {
    p.actual_plant = {
      plant: plant._id,
      local: plant.supplier ? 'Supplier' : 'Factory'
    };

    if(plant.supplier){
      if(plant.supplier.equals(p.supplier._id)){
        if(p.gc16){
          p.actual_gc16 = {
            days: p.gc16.supplierStock.ssDays,
            max: p.gc16.supplierStock.QuantContainerSsMax,
            min: p.gc16.supplierStock.QuantContainerSs,
          }
          console.log("INSERT GC16 SUPPLIER TO PACKING: "+p._id);
        }else{
          delete p.actual_gc16;
        }
      }
    }else{
      if(p.gc16){
        p.actual_gc16 = {
          days: p.gc16.factoryStock.fsDays,
          max: p.gc16.factoryStock.QuantContainerfsMax,
          min: p.gc16.factoryStock.QuantContainerfs,
        }
        console.log("INSERT GC16 FACTORY TO PACKING: "+p._id);
      }else{
        delete p.actual_gc16;
      }
    }

    p.permanence = {
      "amount_days" : 0,
      "date" : new Date().getTime(),
      "time_exceeded" : false
    };

    return p;
  },
  fixed: function (p , plant ) {

    if(plant.supplier){
      if(plant.supplier.equals(p.supplier._id)){
        if(p.gc16){
          p.actual_gc16 = {
            days: p.gc16.supplierStock.ssDays,
            max: p.gc16.supplierStock.QuantContainerSsMax,
            min: p.gc16.supplierStock.QuantContainerSs,
          }
          console.log("INSERT GC16 SUPPLIER TO PACKING: "+p._id);
        }else{
          console.log("REMOVE GC16 SUPPLIER TO PACKING: "+p._id);
          delete p.actual_gc16;
        }
      }
    }else{
      if(p.gc16){
        p.actual_gc16 = {
          days: p.gc16.factoryStock.fsDays,
          max: p.gc16.factoryStock.QuantContainerfsMax,
          min: p.gc16.factoryStock.QuantContainerfs,
        }
        console.log("INSERT GC16 FACTORY TO PACKING: "+p._id);
      }else{
        console.log("REMOVE GC16 FACTORY TO PACKING: "+p._id);
        p.actual_gc16 = null;
      }
    }
    // console.log(p);
    return p;
  }

}
