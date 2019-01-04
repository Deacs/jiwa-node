var express = require('express');
var router = express.Router();

// Get user list
router.get('/userlist', function(req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  collection.find({}, {}, function(e, docs) {
    res.json(docs);
  });
});

// Post to add user
router.post('/adduser', function(req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  collection.insert(req.body, function(err, result) {
    // Add an error message back to the payload
    // It's presence is checked to determine a successful insert
    result.msg = (err == null) ? '' : err;
    res.send(
      result
    );
  });
});

// Delete user
router.delete('/deleteuser/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  var userToDelete = req.params.id;
  collection.remove({ '_id': userToDelete }, function(err) {
    res.send((err === null) ? { msg: '' } : { msg: err });
  });
});

// Retrieve user
router.get('/:id', function(req, res) {
  // console.log('Getting User : ');
  // console.log(req.params.id)
  var db = req.db;
  var collection = db.get('userlist');
  var userToRetrieve = req.params.id;
  // collection({
  //   '_id': 'ObjectId("' + userToRetrieve + '")'
  // });

  collection.findOne({'_id': userToRetrieve})
    .then((doc) => {
      console.log('-----------------');
      console.log('User Object');
      console.log(doc);
      console.log('-----------------');
      res.json(doc);
    });

  // collection.find({
  //   '_id': 'ObjectId("' + userToRetrieve + '")'
  // }, {}, function(e, docs) {
  //   console.log('Error:');
  //   console.log(e);
  //   console.log('-----------------');
  //   console.log('User Object');
  //   console.log(docs);
  //   console.log('-----------------');
  //   res.json(docs);
  // });
});

module.exports = router;
