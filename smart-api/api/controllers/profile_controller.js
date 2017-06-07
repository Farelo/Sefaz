'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var profile = mongoose.model('Profile');

/**
 * Create a Category
 */
exports.profile_create = function(req, res) {
    profile.create(req.body)
           .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
           .then(success => res.json({code:200, message: "OK", response: success}))
};

/**
 * Show the current Category
 */
exports.profile_read = function(req, res) {
    profile.findOne({
            _id: req.swagger.params.profile_id.value
        })
        .then(profile => res.json({code:200, message: "OK", data: profile}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

/**
 * Update a Category
 */
exports.profile_update = function(req, res) {  
    profile.update( {
            _id: req.swagger.params.profile_id.value
        },  req.body,   {
            upsert: true
        })
        .then(success => res.json({code:200, message: "OK", response: success}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err})); 
};
/**
 * Delete an Category
 */
exports.profile_delete = function(req, res) { 
    profile.remove({
            _id: req.swagger.params.profile_id.value
        })
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
        .then(success => res.json({code:200, message: "OK", response: success}));

};
/**
 * List of Categories
 */
exports.profile_list = function(req, res) { 
    company.find({})
        .then(profiles => res.json({code:200, message: "OK", data: profiles}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

exports.profile_listPagination = function(req, res) { 
    var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
    var profileList = profile.find({})
        .skip(value).limit(parseInt(req.swagger.params.limit.value))
        .sort({_id: 1});
    var count = profile.find({}).count();

    Promise.all([count,profileList])
        .then(result => res.json({code:200, message: "OK", "count": result[0], "profiles": result[1]}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
