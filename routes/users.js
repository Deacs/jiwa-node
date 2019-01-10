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
  var db = req.db;
  var collection = db.get('userlist');
  var userToRetrieve = req.params.id;

  collection.findOne({'_id': userToRetrieve})
    .then((doc) => {
      res.json(doc);
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

// Update user
router.put('/update/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  var userToUpdate = req.params.id;

  collection.update({  '_id': userToUpdate }, { $set: req.body }, function (err, result) {
    // Add an error message back to the payload
    // It's presence is checked to determine a successful update
    result.msg = (err == null) ? '' : err;
    // Return the entire user object so it can be used by the caller
    result.body = req.body;
    // Return the ID so we can use it if we need it
    result._id = userToUpdate;
    res.send(
      result
    );
  })
});

module.exports = router; 
