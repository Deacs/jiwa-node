var express = require('express');
var router = express.Router();

// Get user list
router.get('/userlist', function(req, res) {
  var db = req.db;
  console.log('Getting User List');
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
    res.send(
      (err == null) ? { msg: '' } : { msg: err }
    );
  });
});

router.delete('/deleteuser/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  var userToDelete = req.params.id;
  collection.remove({ '_id': userToDelete }, function(err) {
    res.send((err === null) ? { msg: '' } : { msg: err });
  });
});

module.exports = router;
