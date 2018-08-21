const schemas = require('../schemas/require_schemas');
const queries_packing = require('../helpers/queries/complex_queries_packing');
const _ = require('lodash');
const responses = require('../helpers/responses/index');

exports.getStats = async (req, res) => {
    const aggregate = await schemas.packing.aggregate(queries_packing.queries.home_stats());
    res.json(aggregate[0]);
};

exports.getPackingsByStatus = (req, res) => {
    const params = {
        limit: parseInt(req.swagger.params.limit.value) || 10,
        page: parseInt(req.swagger.params.page.value) || 1,
        status: req.swagger.params.status.value,
    };
    schemas.packing
        .paginate({ status: params.status}, { limit: params.limit, page: params.page, populate: ['actual_plant.plant', 'last_plant.plant']})
        .then(
            _.partial(
                responses.successHandlerPagination,
                res,
                req.user.refresh_token,
            )
        )
        .catch(
            _.partial(
                responses.errorHandler,
                res,
                'Error to list packings by status',
            )
        );
};

exports.getPackingsLowBattery = (req, res) => {
    const params = {
        limit: parseInt(req.swagger.params.limit.value),
        page: parseInt(req.swagger.params.page.value)
    };

    schemas.settings.find({})
        .then(settings => {
            const query = { battery: { $lte: settings[0].battery_level } }
            schemas.packing.paginate(query, { page: params.page, limit: params.limit, populate: ['actual_plant.plant', 'last_plant.plant'] })
                .then(
                    _.partial(
                        responses.successHandlerPagination,
                        res,
                        req.user.refresh_token,
                    )
                )
                .catch(
                    _.partial(
                        responses.errorHandler,
                        res,
                        'Error to packings with low battery',
                    )
            );
    });
    
    // const aggregate = schemas.packing.aggregate(
    //     queries_packing.queries.home_packings_low_battery()
    // );

    // schemas.packing.aggregatePaginate(
    //     aggregate,
    //     {
    //         page: params.page,
    //         limit: params.limit
    //     },
    //     _.partial(
    //         responses.successHandlerPaginationAggregate,
    //         res,
    //         req.user.refresh_token,
    //         req.swagger.params.page.value,
    //         req.swagger.params.limit.value,
    //     ),
    // );
};