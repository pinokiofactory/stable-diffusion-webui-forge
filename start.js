module.exports = {
  requires: {
    bundle: "ai"
  },
  daemon: true,
  run: [{
    method: "shell.run",
    params: {
      path: "app",
      env: {
        SD_WEBUI_RESTARTING: 1,
        TOKENIZERS_PARALLELISM: "false"
      },
      message: "{{platform === 'win32' ? 'webui-user.bat' : 'bash webui.sh -f'}}",
      on: [{
        "event": "/http:\/\/[0-9.:]+/",
        "done": true
      }, {
        "event": "/error:/i",
        "break": false
      }]
    }
  }, {
    method: "local.set",
    params: {
      "url": "{{input.event[0]}}",
    }
  }]
}
