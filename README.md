# KeeDiary Desktop App · Kee日记 - 桌面应用

A trusted journal editor that uses kdbx as a database encryption to store your journals.

可信任的日记编辑器，使用 kdbx 作为数据库加密存储您的日记。

> With Syncthing, it's easy to sync databases across different devices.

> 配合 Syncthing 使用，可以方便的在不同设备同步数据库。

## TechStack · 技术栈

- Electron
- React (create-react-app、react全家桶，新手学习 React 中，存在诸多性能问题等待后期优化...)
- [kdbxweb](https://github.com/keeweb/kdbxweb) (用于操作数据库，由于网络问题使用了拷贝的国内源)

## Features · 特性

- [X] 打开数据库（`密码`/`密码+密钥`）
- [X] 浏览群组(groups)和群组里面的条目(entries)
- [X] 保存数据库/关闭数据库
- [X] 使用一个变量判断数据库是否被改动
- [ ] 构建索引以实现搜索功能 🚨
- 群组(groups)
    - [X] 重命名群组
    - [X] 移动至回收站（如果关闭了回收站则直接删除群组）
    - [X] 清空回收站
    - [X] 移动群组
    - [X] 新建群组
    - [ ] 列表的展开与收缩
    - [ ] 渲染性能优化
- 条目(entries)
    - [X] 标题(Title)和内容(Note)的查看与编辑
    - [X] 创建新条目
    - [X] 删除条目
    - [X] 移动条目
    - [ ] 排序（按创建或修改日期排序）🚨
    - [ ] Markdown支持

## Run · 运行

```sh
# 安装依赖
yarn install

# 开发模式 
npm run dev
```

## Build · 构建

```sh
# 全局安装 electron-builder
npm -i -g electron-builder

# 首先构建 React
npm run build:react

# 构建 electron 生成可执行文件
npm run build:electron
```

## Reference · 参考

- [Building an Electron application with create-react-app](https://www.freecodecamp.org/news/building-an-electron-application-with-create-react-app-97945861647c/)
- [Electron.js 快速入坑指南 - Windows 下的打包](https://canwdev.gitee.io/manual/setup-electronjs.html#windows-%E4%B8%8B%E7%9A%84%E6%89%93%E5%8C%85)
- [KdbxWeb 国内拷贝并修改依赖源](https://gitee.com/canwdev/kdbxweb)
