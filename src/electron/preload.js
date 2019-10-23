const { shell , remote } = require('electron');

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  var API = function() {
    const fs = remote.require('fs')

    // 外部浏览器打开链接
    this.openExternal = shell.openExternal
    // 打开文件选择器
    this.openFileChooser = function (filters=[]) {
      return remote.dialog.showOpenDialogSync({
        properties: ['openFile'],
        filters: filters
      })
    }

    // fs
    this.readFileSyncAsArrayBuffer = function (path) {
      let res
      try {
        const file = fs.readFileSync(path)
        res = new Uint8Array(file).buffer
      } catch (e) {
        alert(e)
        console.log(e)
        throw new Error(e)
      }

      return res
    }

    this.showErrorBox = function (title, content) {
      remote.dialog.showErrorBox(title, content)
    }
  }

  window.api = new API()
})
