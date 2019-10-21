const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const {Menu, app, dialog} = electron

let menus = [
  {
    label: '文件',
    submenu: [
      {
        label: '打开',
        accelerator: 'ctrl+o',
        click: function () {
          dialog.showOpenDialog({
            properties: ['openFile', 'multiSelections']
          }, function (files) {
            if (files !== undefined) {
              // handle files
            }
          })
        }
      },
      {
        label: '退出',
        accelerator: 'ctrl+q',
        click: function () {
          app.quit();
        }
      },
    ]
  },
  {
    label: '查看',
    submenu: [{
      label: '重载',
      accelerator: 'CmdOrCtrl+R',
      click: function (item, focusedWindow) {
        if (focusedWindow) {
          // 重载之后, 刷新并关闭所有的次要窗体
          if (focusedWindow.id === 1) {
            BrowserWindow.getAllWindows().forEach(function (win) {
              if (win.id > 1) {
                win.close()
              }
            })
          }
          focusedWindow.reload()
        }
      }
    }, {
      label: '切换全屏',
      accelerator: (function () {
        if (process.platform === 'darwin') {
          return 'Ctrl+Command+F'
        } else {
          return 'F11'
        }
      })(),
      click: function (item, focusedWindow) {
        if (focusedWindow) {
          focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
        }
      }
    }, {
      label: '切换开发者工具',
      accelerator: (function () {
        if (process.platform === 'darwin') {
          return 'Alt+Command+I'
        } else {
          return 'Ctrl+Shift+I'
        }
      })(),
      click: function (item, focusedWindow) {
        if (focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      }
    }, {
      type: 'separator'
    }, {
      label: '应用程序菜单演示',
      click: function (item, focusedWindow) {
        if (focusedWindow) {
          const options = {
            type: 'info',
            title: '应用程序菜单演示',
            buttons: ['好的'],
            message: '此演示用于 "菜单" 部分, 展示如何在应用程序菜单中创建可点击的菜单项.'
          }
          electron.dialog.showMessageBox(focusedWindow, options, function () {
          })
        }
      }
    }]
  },
  {
    label: '帮助',
    role: 'help',
    submenu: [{
      label: '学习更多',
      click: function () {
        electron.shell.openExternal('https://electronjs.org/')
      }
    }]
  }
]

let m = Menu.buildFromTemplate(menus)
Menu.setApplicationMenu(m)
