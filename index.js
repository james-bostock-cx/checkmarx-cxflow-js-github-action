const core = require('@actions/core');
const github = require('@actions/github');
const { spawn } = require('node:child_process');

try {
    const cxflow = spawn('java ' + core.getInput('java_opts') + ' -jar ' + core.getInput('cxflow_jar_path'))
    cxflow.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    cxflow.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    cxflow.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
} catch (error) {
    core.setFailed(error.message);
}
