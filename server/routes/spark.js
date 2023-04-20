var express = require('express');
var router = express.Router();
var schedule = require('../lib/schedule');
var stop = require('../lib/stop');
var run = require('../lib/run');
var load = require('../lib/load');

const multer = require('multer');
const upload = multer();

global.jobs = {};

router.post('/start_and_attach', upload.any(), function(req, res, next) {
  const file = req.files[0];
  schedule(file).then((attach_info) => {
    const [status, file, job, container] = attach_info;
    global.jobs[job.id] = {job: job, container: container};
    res.setHeader("Content-Type", "application/json");
    if (status) {
      res.writeHead(500);
      res.end(JSON.stringify({status: status}, null, 3));
    } else {
      res.writeHead(200);
      res.end(JSON.stringify({job: job, container: container}, null, 3)); 
    }
  });
});

router.post('/load_source', upload.any(), function(req, res, next) {
  const file = req.files[0];
  const job = req.body.data.job;
  const container = req.body.data.container; 
  load(file, job, container).then((attach_info) => {
    const [status, message, file] = attach_info;
    global.jobs[job.id] = {job: job, container: container};
    res.setHeader("Content-Type", "application/json");
    if (status) {
      res.writeHead(500);
      res.end(JSON.stringify({status: status}, null, 3));
    } else {
      res.writeHead(200);
      res.end(JSON.stringify({job: job, container: container}, null, 3)); 
    }
  });
});

router.post('/stop', function(req, res, next) {
  const job_id = req.body.id;
  const container = global.jobs[job_id].container;

  stop(container).then((exit) => {
    res.setHeader("Content-Type", "application/json");
    delete global.jobs[job_id];
    if (exit) {
      res.writeHead(500);
      res.end(JSON.stringify({status: exit}, null, 3));
    } else {
      res.writeHead(200);
      res.end(JSON.stringify({status: exit}, null, 3)); 
    }
  });
});

router.post('/run', function(req, res, next) {
  const job_id = req.body.id;
  const job_argv = req.body.argv;
  const container = global.jobs[job_id].container;
  const job = global.jobs[job_id].job;
  job.argv = job_argv;

  run(container, job).then((exit) => {
    res.setHeader("Content-Type", "application/json");
    if (exit) {
      res.writeHead(500);
      res.end(JSON.stringify({status: exit}, null, 3));
    } else {
      res.writeHead(200);
      res.end(JSON.stringify({status: exit}, null, 3)); 
    }
  });
});

module.exports = router;
