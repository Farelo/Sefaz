'use strict';

module.exports = function (p, plant) {

  if (plant.logistic_operator) {
    let map = plant.logistic_operator.suppliers.map(p => String(p));
    let result = p.routes.filter(r => map.indexOf(String(r.supplier)) != -1);
    if (result.length > 0) {
      return true;
    } else {
      return false;
    }
  } else {
    let result = p.routes.filter(r => r.plant_factory.equals(plant._id) || r.plant_supplier.equals(plant._id));
    if (result.length > 0) {
      return true;
    } else {
      return false;
    }
  }

}
