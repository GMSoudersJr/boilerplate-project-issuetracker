/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
         assert.isTrue(res.body.open)
         assert.equal(res.body.issue_title,  'Title')
         assert.equal(res.body.issue_text,  'text')
         assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
         assert.equal(res.body.assigned_to, 'Chai and Mocha')
         assert.equal(res.body.status_text, 'In QA')
         assert.exists(res.body.created_on)
         assert.exists(res.body.updated_on)
          //fill me in too!
          
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Required fields filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
         assert.isTrue(res.body.open)
         assert.isDefined(res.body.issue_title)
         assert.isDefined(res.body.issue_text)
         assert.isDefined(res.body.created_by)
          done();
        });

      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: '',
          issue_text: '',
          created_by: ''
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
         assert.isTrue(res.body.open)
         assert.isNotOk(res.body.issue_title)
         assert.isNotOk(res.body.issue_text)
         assert.isNotOk(res.body.created_by)
        done();
        });

      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '5cdd984d2b8aea0bbd042212',
          issue_title: '',
          issue_text: '',
          created_by: '',
          assigned_to: '',
          status_text: ''
        })
        .end(function(err, res){
          assert.equal(res.status, 200, "great");
          assert.equal(res.body, "no updated field sent")      
          done();
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '5cdd984d2b8aea0bbd042212',
          issue_title: 'One field to update',
          issue_text: '',
          created_by: '',
          assigned_to: '',
          status_text: ''
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body, "successfully updated")      
          done();
        });

      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '5cdd984d2b8aea0bbd042212',
          issue_title: 'Multiple fields to update',
          issue_text: 'Update',
          created_by: 'Multiple fields to update',
          assigned_to: 'Multiple fields',
          status_text: 'Updated'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body, "successfully updated")      
          done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          open:'false'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.equal(res.body[0].open, false);
          done();
        });

      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          open:'false',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.equal(res.body[0].open, false);
          assert.equal(res.body[0].status_text, 'In QA')
          done();
        });

      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: '5cd9a016edd3281df905b14'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body, "failed: could not delete 5cd9a016edd3281df905b14")      
          done();
        });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: '5cd9a016edd3281df905b149'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body, "success: deleted 5cd9a016edd3281df905b149")      
          done();
        });
      });
      
    });

});
