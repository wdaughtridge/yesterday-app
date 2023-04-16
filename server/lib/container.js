const { execSync } = require('node:child_process');

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
        this.out = null;
        this.err = null;
    }
    get host() {
        return this.id ? this.id.substring(0, 12) : null;
    }
    start() {
        const data = execSync(['docker', 'run', '--rm', '-it', '-d', `${this.img}:${this.ver}`].join(' '));
        this.id = new String(data).trim();
        return this.id;
    }
    stop() {
        return execSync(['docker', 'stop', this.id].join(' '));
    }
    cp_to_inst(src, dest) {
        return execSync(['docker', 'cp', src, `${this.id}:${dest}`].join(' '));
    }
    cp_to_host(src, dest) {
        return execSync(['docker', 'cp', `${this.id}:${src}`, dest].join(' '));
    }
    submit(file) {
        return execSync(['docker', 'exec', this.id, '/usr/src/app/bin/spark-submit', '--master', `spark://${this.host}:7077`, file].join(' '));
    }
    spark_start_and_submit(job) {
        try {
            this.start();
            this.cp_to_inst(job.file, `/usr/src/app/job_${job.id}.py`);
            this.submit(`/usr/src/app/job_${job.id}.py`);
            this.cp_to_host("/usr/src/app/job_result.txt", `/usr/src/app/res_${job.id}.txt`);
            this.stop();
            return [0, job.id];
        } catch (error) {
            return [1, `There was an error in job ${job.id}. stderr: ${error}`];
        }
    }
}

class SparkJob {
    constructor(job_file) {
        this.id = crypto.randomUUID();
        this.file = job_file;
    }
    get res() {
        return `/usr/src/app/res_${this.id}.txt`;
    }
    *config() {
        yield this.id;
        yield this.file;
        yield this.res;
    }
}

module.exports = { SparkInstance, SparkJob };