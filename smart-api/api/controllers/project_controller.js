'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var project = mongoose.model('Project');

/**
 * Create a Category
 */
exports.project_create = function(req, res) {

    project.create(req.body)
           .catch(err => res.status(404).send({code:404, message: "ERROR", response: err}))
           .then(success => res.json({code:200, message: "OK", response: success}))

};

/**
 * Show the current Category
 */
exports.project_read = function(req, res) {
    project.findOne({
            _id: req.swagger.params.project_id.value
        })
        .then(project => res.json({code:200, message: "OK", data: project}))
        .catch(err => res.status(404).send({code:404, message: "ERROR", response: err}));
};

/**
 * Update a Category
 */
exports.project_update = function(req, res) {  
    project.update( {
            _id: req.swagger.params.project_id.value
        },  req.body,   {
            upsert: true
        })
        .then(success => res.json({code:200, message: "OK", response: success}))
        .catch(err => res.status(404).send({code:404, message: "ERROR", response: err})); 
};
/**
 * Delete an Category
 */
exports.project_delete = function(req, res) { 
    project.remove({
            _id: req.swagger.params.project_id.value
        })
        .catch(err => res.status(404).send({code:404, message: "ERROR", response: err}))
        .then(success => res.json({code:200, message: "OK", response: success}));

};
/**
 * List of Categories
 */
 exports.project_listPagination = function(req, res) { 
     var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
     var projectList = project.find({})
         .skip(value).limit(parseInt(req.swagger.params.limit.value))
         .sort({_id: 1});
     var count = project.find({}).count();

     Promise.all([count,projectList])
         .then(result => res.json({code:200, message: "OK", "count": result[0], "projects": result[1]}))
         .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
 };


 /**
  * List of Categories
  */
  exports.project_list= function(req, res) { 

    project.find({})
        .then(tags => res.json({code:200, message: "OK", data: tags}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
  };
