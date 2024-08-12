module.exports = {
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
      venv: "app/venv",
      on: [{ "event": "/http:\/\/[0-9.:]+/", "done": true }]
    }
  }, {
    method: "local.set",
    params: {
      "url": "{{input.event[0]}}",
    }
  }]
}
