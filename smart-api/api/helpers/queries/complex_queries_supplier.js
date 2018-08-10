

exports.queries = {
  supplierListByDuns(code) {
    return [
      {
        $match: {
          duns: code,
        },
      },
      {
        $lookup: {
          from: 'routes',
          localField: '_id',
          foreignField: 'supplier',
          as: 'routeObject',
        },
      },
      {
        $unwind: '$routeObject',
      },
      {
        $lookup: {
          from: 'packings',
          localField: 'routeObject.hashPacking',
          foreignField: 'hashPacking',
          as: 'packingObject',
        },
      },
      {
        $unwind: '$packingObject',
      },
      {
        $lookup: {
          from: 'plants',
          localField: 'packingObject.actual_plant',
          foreignField: '_id',
          as: 'plantObject',
        },
      },
      {
        $lookup: {
          from: 'departments',
          localField: 'packingObject.department',
          foreignField: '_id',
          as: 'departmentObject',
        },
      },
      {
        $unwind: '$plantObject',
      },
      {
        $unwind: '$departmentObject',
      },
      {
        $group: {
          _id: {
            code: '$packingObject.code',
            plant: '$plantObject._id',
            department: '$departmentObject._id',
          },
          quantity: {
            $sum: 1,
          },
          packing: {
            $first: '$packingObject',
          },
          supplier: {
            $first: '$name',
          },
          department: {
            $first: '$departmentObject',
          },
          plant: {
            $first: '$plantObject',
          },
        },
      },
    ];
  },
  group: [
    {
      $group: {
        _id: '$name',
        id: {
          $first: '$name',
        },
        text: {
          $first: '$name',
        },
        children: { $push: { id: '$_id', text: '$duns' } },
      },
    },
  ],
};
