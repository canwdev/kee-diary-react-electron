const { shell, ipcRenderer, remote } = require('electron');

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  var API = function() {
    const fs = remote.require('fs')
    this.openExternal = shell.openExternal
  }

  window.api = new API()
})
