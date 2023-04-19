const { execSync } = require('node:child_process');
const fs = require('fs');

let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}

class SparkInstance {
    constructor(host_port, docker_image, image_version) {
        this.port = host_port;
        this.img = docker_image;
        this.ver = image_version;
        this.id = null;
        this.host = null;
    }
    start() {
        const data = execSync(['docker', 'run', '--rm', '-it', '-d', `${this.img}:${this.ver}`].join(' '));
        this.id = new String(data).trim();
        this.host = this.id.substring(0, 12);
        return this.id;
    }
    cp_to_inst(src, dest) {
        return execSync(['docker', 'cp', src, `${this.id}:${dest}`].join(' '));
    }
    cp_to_host(src, dest) {
        return execSync(['docker', 'cp', `${this.id}:${src}`, dest].join(' '));
    }
    spark_start_and_attach(job) {
        try {
            this.start();
            fs.writeFileSync(`./job_${job.id}.py`, job.file.buffer);
            this.cp_to_inst(`./job_${job.id}.py`, `/usr/src/app/job_${job.id}.py`);
            return [0, `/usr/src/app/job_${job.id}.py`];
        } catch (error) {
            return [1, `There was an error in job ${job.id}. stderr: ${error}`];
        }
    }
    static run(instance, job) {
        return execSync(['docker', 'exec', instance.id, '/usr/src/app/bin/spark-submit', '--master', `spark://${instance.host}:7077`, job.path, job.argv].join(' '));
    }
    static stop(id) {
        return execSync(['docker', 'stop', id].join(' '));
    }
}

class SparkJob {
    constructor(job_file) {
        this.id = crypto.randomUUID();
        this.file = job_file;
        this.path = `/usr/src/app/job_${this.id}.py`;
        this.argv = "";
    }
    *config() {
        yield this.id;
        yield this.file;
        yield this.res;
    }
}

module.exports = { SparkInstance, SparkJob };