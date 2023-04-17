const {
    Worker, isMainThread, parentPort, workerData,
} = require('node:worker_threads');

if (isMainThread) {
    module.exports = function stop(instance) {
        return new Promise((resolve, reject) => {
            const worker = new Worker(__filename, {
                workerData: instance,
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
    const instance = workerData;
    const out = SparkInstance.stop(instance.id);
    const testOut = String.fromCharCode.apply(null, out).trim();
    parentPort.postMessage(testOut == instance.id ? 0 : 1);
}