const core = require('@actions/core');
const github = require('@actions/github');
const { spawn } = require('node:child_process');

try {
    const cxflow = spawn(core.getInput('java_path'), [
        core.getInput('java_opts'),
        '-jar',
        core.getInput('cxflow_jar_path'),
        '--scan',
        '--f=.'
    ])
    cxflow.stdout.on('data', (data) => {
        data = data.replace(/\n$/, "");
        console.log(`stdout: ${data}`);
    });

    cxflow.stderr.on('data', (data) => {
        data = data.replace(/\n$/, "");
        console.error(`stderr: ${data}`);
    });

    cxflow.on('close', (code) => {
        if (code !== 0) {
            core.setFailed(`child process exited with code ${code}`);
        }
    });
} catch (error) {
    core.setFailed(error.message);
}
