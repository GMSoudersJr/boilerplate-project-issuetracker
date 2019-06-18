/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
const mongo       = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const cors = require('cors')
var connection = mongoose.createConnection(process.env.DB, {useNewUrlParser: true});

const CONNECTION_STRING = process.env.DB; 
MongoClient.connect(CONNECTION_STRING, {useNewUrlParser: true}, function(err, db) {});

var db = connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('database connection: Successful!')
  //console.log(db)

});

//Schema-time

const Schema = mongoose.Schema;
const issueSchema = new Schema({
  project: String,
  issue_title: String,
  issue_text: String,
  created_by: String,
  assigned_to: String,
  open: {type: Boolean, default: true},
  status_text:String
}, {timestamps: {createdAt: 'created_on', updatedAt: "updated_on"}});


var Issue = db.model('Issue', issueSchema);

module.exports = function (app) {
  //Logger
app.use(function(req, res, next){
console.log(req.method +' '+ req.path  + ' - ' + req.ip)
next()
})

const wasNotQueried = /.*/
  
app.use(cors())

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      let title = req.query.issue_title,
        text = req.query.issue_text,
        author = req.query.created_by,
        assigned = req.query.assigned_to,
        status_text = req.query.status_text,
        open = req.query.open;
    
    title===undefined?title=wasNotQueried:title
    text===undefined?text=wasNotQueried:text=RegExp(text)
    author===undefined?author=wasNotQueried:author
    assigned===undefined?assigned=wasNotQueried:assigned
    status_text===undefined?status_text=wasNotQueried:status_text
    open===undefined?Issue.find({project: project})
      .where({issue_title:title})
      .where({issue_text: text})
      .where({created_by: author})
      .where({assigned_to: assigned})
      .where({status_text: status_text})
      .select('-__v -project')
      .sort('-updated_on')
      .exec((err, docs)=>{err?res.send(err):res.send(docs)})
    :Issue.find({project: project})
      .where({issue_title : title})
      .where({issue_text: text})
      .where({created_by: author})
      .where({assigned_to: assigned})
      .where({status_text: status_text})
      .where({open: open})
      .select('-__v -project')
      .sort('-updated_on')
      .exec((err, docs)=>{err?res.send(err):res.send(docs)})
    // Issue.find({project: project}).exec((err, docs)=>{res.send(docs)})
    
    })
    
    .post(function (req, res){
      var project = req.params.project;
      var title = req.body.issue_title,
        text = req.body.issue_text,
        author = req.body.created_by,
        assigned = req.body.assigned_to,
        status_text = req.body.status_text,
        open = req.body.open;
    
      var createIssue = function (done){
        var issue = new Issue({project: project, 
                               issue_title : title,
                               issue_text : text,
                               created_by : author,
                               assigned_to : assigned,
                               status_text : status_text});
        issue.save((err, issue)=>{
          err?res.send(err):
        res.json(issue)
        });
      }
      
      createIssue()
    })
    
    .put(function (req, res){
      var project = req.params.project,
          id = req.body._id,
          updatedTitle, updatedText, updatedCreatedBy, updatedAssignedTo, updatedStatusText,
          open = req.body.open;
    req.body.issue_title? updatedTitle=req.body.issue_title:updatedTitle=''
    req.body.issue_text? updatedText=req.body.issue_text:updatedText=''
    req.body.created_by? updatedCreatedBy=req.body.created_by:updatedCreatedBy=''
    req.body.assigned_to? updatedAssignedTo=req.body.assigned_to:updatedAssignedTo=''
    req.body.status_text? updatedStatusText=req.body.status_text:updatedStatusText=''
    
    console.log(open + ' ' + updatedTitle)
    console.log(req.body.issue_title)
    var updateIssue = function (done){
       Issue.findOne({_id:id}, '-__v, -project', function(err, data){
        if (data===null || data===undefined) {
           res.send("could not update "+ id + " because it doesn't exist")
         } else 
           if (updatedTitle === '' && updatedText === '' && updatedCreatedBy === '' && updatedAssignedTo === '' && updatedStatusText === '' && open === undefined){
        res.json("no updated field sent")
      } else { 
         err?res.send(err+" no ID"):console.log(data._id + " is going to be updated")
         Issue.findOneAndUpdate({ _id : id }, { issue_title : updatedTitle !==''? updatedTitle : data.issue_title,
                                         issue_text : updatedText !==''? updatedText : data.issue_text,
                                         created_by : updatedCreatedBy !==''? updatedCreatedBy : data.created_by,
                                         assigned_to : updatedAssignedTo !==''? updatedAssignedTo : data.assigned_to,
                                         status_text : updatedStatusText !==''? updatedStatusText : data.status_text,
                                         open : open === undefined ? true : false},
                                {new:true, fields: '-__v, -project'},
                                (err, updated)=>{
           err?res.json("could not update " + id):res.json("successfully updated")
         return updated
         })
      }
       })
    }
      updateIssue()      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      var deleteIssue = function (done){
       Issue.deleteOne({_id:req.body._id}, (err, deleted)=>{
         err?res.json("failed: could not delete "+req.body._id):res.json("success: deleted " +req.body._id)
       }) 
      }
      deleteIssue()
    });
};
