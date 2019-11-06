# KeeDiary · KeePass 日记 - 桌面应用

可信任的日记编辑器，使用 kdbx 作为数据库加密存储您的日记。

> 配合 syncthing 使用，可以方便的在不同设备同步数据库。

## 技术栈

- Electron
- React (create-react-app、react全家桶，新手学习 React 中，存在诸多性能问题等待后期优化...)
- [kdbxweb](https://github.com/keeweb/kdbxweb) (用于操作数据库，由于网络问题使用了拷贝的国内源)

## Run

```sh
# 安装依赖
yarn install

# 开发模式 
npm run dev
```

## Build

```sh
# 全局安装 electron-builder
npm -i -g electron-builder

# 首先构建 React
npm run build:react

# 构建 electron 可执行文件
npm run build:electron
```

## Reference

- [Building an Electron application with create-react-app](https://www.freecodecamp.org/news/building-an-electron-application-with-create-react-app-97945861647c/)
- [Electron.js 快速入坑指南 - Windows 下的打包](https://canwdev.gitee.io/manual/setup-electronjs.html#windows-%E4%B8%8B%E7%9A%84%E6%89%93%E5%8C%85)
