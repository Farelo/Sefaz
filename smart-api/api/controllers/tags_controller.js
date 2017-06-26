'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var tags = mongoose.model('Tags');
var friendly_tag = mongoose.model('FriendlyTag');
const request = require('request');
var query = require('../helpers/queries/complex_queries_tag');
/**
 * Create a Category
 */

function joinParams(body, dev, res) {
      var body_friendly = [];

      body.forEach(function(o) {
          var device = dev.filter(i => i.attributes.ID === o.code)[0];
          o.mac = device.attributes.MAC;
          o.status = device.attributes.last_location;
          body_friendly.push({'tag_mac': device.attributes.MAC});
      });

      console.log(body);

      friendly_tag.create(body_friendly)
        .then(friendlies => tags.create(JoinFriendlyName(friendlies,body)))
        .then(success => res.json({code:200, message: "OK", response: success}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));

}

function JoinFriendlyName(friendlies,body){
  body.forEach((o,index) => o.friendly_name = friendlies[index].code);
  return body;
};

exports.tags_create = function(req, res) {
    var devArray = [];

    req.body.forEach(o => devArray.push(getInfoScanner(o.code)));
    console.log(req.body);
    Promise.all(devArray)
        .then(result => joinParams(req.body, result, res))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

/**
 * Show the current Category
 */
exports.tags_read = function(req, res) {
    tags.findOne({
            _id: req.swagger.params.tags_id.value
        })
        .then(tag => res.json({code:200, message: "OK", data: tag}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

exports.tags_read_by_mac = function(req, res) {
    tags.findOne({
            mac: req.swagger.params.tags_mac.value
        })
        .then(tag => res.json({code:200, message: "OK", data: tag}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
/**
 * Update a Category
 */
exports.tags_update = function(req, res) {  
    tags.update({
            _id: req.swagger.params.tags_id.value
        }, req.body,   {
            upsert: true
        })
        .then(success => res.json({code:200, message: "OK", response: success}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err})); 
};
/**
 * Delete an Category
 */
exports.tags_delete = function(req, res) { 
    tags.remove({
            _id: req.swagger.params.tags_id.value
        })
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
        .then(tags => res.json({code:200, message: "OK", data: tags}));

};

exports.tags_list_all = function(req, res) { 
    tags.find({})
        .then(tags => res.json({code:200, message: "OK", data: tags}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

exports.tags_list_all_no_binded_pagination = function(req, res) { 
    var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;

    var tagslist = tags.aggregate(query.queries.listTagsNoBinded)
        .skip(value)
        .limit(parseInt(req.swagger.params.limit.value));

    var count = tags.find({}).count();

    Promise.all([count, tagslist])
        .then(result => res.json({code:200, message: "OK", "count": result[0], "tags": result[1]}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));

};


exports.tags_list_all_no_binded = function(req, res) { 

    tags.aggregate(query.queries.listTagsNoBinded)
        .then(result => res.json({code:200, message: "OK",  "data": result}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));

};

exports.tags_list_pagination = function(req, res) {
    var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;

    var tagslist = tags.aggregate(query.queries.listTagsBindedAndNoBinded)
        .skip(value)
        .limit(parseInt(req.swagger.params.limit.value));

    var count = tags.aggregate(query.queries.listTagsNoBindedAmount);
    Promise.all([count, tagslist])
        .then(result => res.json({code:200, message: "OK", "count": result[0].count, "tags": result[1]}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

/*
 PROMISES
*/
function getInfoScanner(code) {
    return new Promise(function(resolve, reject) {
        var options = {
            url: 'http://reciclapac.track.devtec.com.br/api/management/devices/' + code,
            method: 'GET',
            headers: {
                'x-ha-access': 'reciclapac',
                'content-type': 'application/json'
            }
        }

        var callback = function(error, response, body) {
            if (error)
                reject(error);

            var info = JSON.parse(body);
            resolve(info);
        }

        request(options, callback);
    });
}
