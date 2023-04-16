var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader("Content-Type", "text/html");
  res.writeHead(200);
  res.sendFile(path.join('/usr/src/app/out/index.html'));
});

module.exports = router;
