var express = require('express');
var router = express.Router();
var schedule = require('../lib/schedule');
const fs = require('fs');

router.post('/', function(req, res, next) {
  const path = req.body.data;

  schedule(path).then((job) => {
    const [status, id] = job;
    res.setHeader("Content-Type", "application/json");
    fs.readFile(`/usr/src/app/res_${id}.txt`, 'utf8', (err, data) => {
      if (err || status) {
        res.writeHead(500);
        res.end(JSON.stringify({error: status ? message : err}, null, 3));
      } else {
        res.writeHead(200);
        res.end(JSON.stringify({data: data, id: id}, null, 3));
      }
    });
  });
});

module.exports = router;
