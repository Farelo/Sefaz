

exports.queries = {
  listDepartmentsByPlant: [
    {
      $lookup: {
        from: 'plants',
        localField: 'plant',
        foreignField: '_id',
        as: 'plantObject',
      },
    },
    {
      $unwind: '$plantObject',
    },
    {
      $group: {
        _id: '$plant',
        quantity: {
          $sum: 1,
        },
        departments: { $push: { name: '$name', _id: '$_id' } },
        plant: { $first: '$plantObject' },
      },
    },
  ],
};
