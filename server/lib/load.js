const {
    Worker, isMainThread, parentPort, workerData,
} = require('node:worker_threads');

if (isMainThread) {
    module.exports = function load(file, job, container) {
        return new Promise((resolve, reject) => {
            const worker = new Worker(__filename, {
                workerData: [file, job, container],
            });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
            });
        });
    };
} else {
    const { SparkInstance } = require('../lib/container');
    const [file, job, container] = workerData;
    const message = SparkInstance.cp_to_inst(`./job_${job.id}.csv`, `/usr/src/app/job_${job.id}.csv`, file.buffer, container.id);
    parentPort.postMessage([0, message, `/usr/src/app/job_${job.id}.csv`]);
}