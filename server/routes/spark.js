var express = require('express');
var router = express.Router();
var schedule = require('../lib/schedule');
var stop = require('../lib/stop');
var run = require('../lib/run');
var load = require('../lib/load');

const multer = require('multer');
const upload = multer();

global.jobs = {};

const respond = (res, exit, body={}) => {
  res.setHeader("Content-Type", "application/json");
  if (exit) {
    res.writeHead(500);
    res.end(JSON.stringify({exit: exit}, null, 3));
  } else {
    res.writeHead(200);
    res.end(JSON.stringify({exit: exit, ...body}, null, 3)); 
  }
}

router.post('/start_and_attach', upload.any(), function(req, res, next) {
  const file = req.files[0];
  schedule(file).then((attach_info) => {
    const [exit, file, job, container] = attach_info;
    global.jobs[job.id] = {job: job, container: container};
    respond(res, exit, {file: file, ...global.jobs[job.id]})
  });
});

router.post('/load_source', upload.any(), function(req, res, next) {
  const file = req.files[0];
  const job = req.body.data.job;
  const container = req.body.data.container; 
  load(file, job, container).then((attach_info) => {
    const [exit, dest] = attach_info;
    respond(res, 0, {dest});
  });
});

router.post('/stop', function(req, res, next) {
  const job_id = req.body.id;
  const container = global.jobs[job_id].container;
  stop(container).then((exit) => {
    delete global.jobs[job_id];
    respond(res, exit);
  });
});

router.post('/run', function(req, res, next) {
  const job_id = req.body.id;
  const job_argv = req.body.argv;
  const container = global.jobs[job_id].container;
  const job = global.jobs[job_id].job;
  job.argv = job_argv;
  run(container, job).then((exit) => {
    respond(res, exit);
  });
});

module.exports = router;
