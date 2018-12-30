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

module.exports = router;
