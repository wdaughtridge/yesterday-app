const {
    Worker, isMainThread, parentPort, workerData,
} = require('node:worker_threads');

if (isMainThread) {
    module.exports = function run(instance, job) {
        return new Promise((resolve, reject) => {
            const worker = new Worker(__filename, {
                workerData: [instance, job],
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
    const [instance, job] = workerData;
    SparkInstance.run(instance, job);
    parentPort.postMessage(0);
}