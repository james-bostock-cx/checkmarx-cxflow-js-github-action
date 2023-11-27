const core = require('@actions/core');
const github = require('@actions/github');
const { spawn } = require('node:child_process');

try {
    var args = [
        core.getInput('java_opts'),
        '-jar',
        core.getInput('cxflow_jar_path'),
        '--scan',
        '--f=.',
        '--checkmarx.base_url=' + core.getInput('checkmarx_url'),
        '--checkmarx.username=' + core.getInput('checkmarx_username'),
        '--checkmarx.password=' + core.getInput('checkmarx_password'),
        '--checkmarx.client-secret=' + core.getInput('checkmarx_client_secret'),
        '--checkmarx.team=' + core.getInput('team'),
        '--cx-project=' + core.getInput('project'),
        '--app=' + core.getInput('app'),
        '--checkmarx.scan-preset=' + core.getInput('preset'),
        '--break-build=' + core.getInput('break_build'),
        '--cx-flow.bug-tracker=' + core.getInput('bug_tracker'),
        '--checkmarx.incremental=' + core.getInput('incremental'),
        '--github.token=' + core.getInput('github_token'),
        '--repo-url=' + core.getInput('repo_url'),
        '--cx-flow.enabled-vulnerability-scanners=' + core.getInput('scanners'),
        '--sca.api-url=' + core.getInput('sca_api_url'),
        '--sca.app-url=' + core.getInput('sca_app_url'),
        '--sca.access-control-url=' + core.getInput('sca_access_control_url'),
    ];

    var params = core.getInput('params');
    if (params) {
        // FIXME: This will break for values with embedded spaces
        args = args.concat(params.split(' '));
    }

    var sca_tenant = core.getInput('sca_tenant');
    if (sca_tenant) {
        args.push('--sca.tenant' + sca_tenant)
    }

    var sca_username = core.getInput('sca_username');
    if (sca_username) {
        args.push('--sca.username' + sca_tenant)
    }

    var sca_password = core.getInput('sca_password');
    if (sca_password) {
        args.push('--sca.password' + sca_tenant)
    }

    const cxflow = spawn(core.getInput('java_path'), args)

    cxflow.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    cxflow.stderr.on('data', (data) => {
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
