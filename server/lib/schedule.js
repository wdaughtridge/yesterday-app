const {
    Worker, isMainThread, parentPort, workerData,
} = require('node:worker_threads');

if (isMainThread) {
    module.exports = function schedule(file) {
        return new Promise((resolve, reject) => {
            const worker = new Worker(__filename, {
                workerData: file,
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
    const { SparkJob, SparkInstance } = require('../lib/container');
    const file = workerData;
    const newJob = new SparkJob(file);
    const newInstance = new SparkInstance(7077, "spark", "latest");
    const [exit, message] = newInstance.spark_start_and_attach(newJob);
    parentPort.postMessage([exit, message, newJob, newInstance]);
}