# SMANIS

## 项目简介

基于物联网的智慧网球计分系统。

## 配置与使用

分为三部分：**前端**，**后端**，**算法**。

前端的代码位于 `packages/frontend/`，后端代码位于 `packages/backend/`，
算法位于 `algorithms/`。

### 前置需求

需要安装 [Node.js](https://nodejs.org/zh-cn/)，[pnpm](https://pnpm.io/zh/)，
[python](https://www.python.org)。具体安装步骤请参阅官网。

后端数据库使用 [MongoDB](https://www.mongodb.com/home)，请下载
[安装包](https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-6.0.3-signed.msi)
安装。

### 项目配置

推荐使用 [Visual Studio Code](https://code.visualstudio.com) 打开项目，
并安装推荐插件以方便开发。

通过 ``Ctrl +  ` ``（键盘数字 1 左边的按键，不是引号）打开终端，执行 `pnpm ready` 命令
安装所有前后端和 python 依赖。

> 注：之后所有操作都应当在项目根目录下执行。

开发时，首先执行 `pnpm dev`，这会启动后端服务器并打包前端页面，并自动开启浏览器。所有的
更改都会实时刷新展示出来。

如果出现 bug，请先尝试重启开发服务器。

前端开发时请在 `localStorage` 中加入 `dev=true` 来进入开发模式。

前端页面监听端口为 10050，后端服务器监听端口为 20080。MongoDB 默认监听 27017 端口。
开发时请勿占用这几个端口。

## 注意事项

1. 配置了 `commitlint`，因此所有 git 提交都需要遵循 [约定式提交](https://www.conventionalcommits.org/zh-hans/v1.0.0/)。
2. 代码规范配置了 `eslint` 与 `prettier`，请尽量遵守，命名请尽量不要使用拼音。
3. TODOs 请查看 [前端](./packages/frontend/README.md)，[后端](./packages/backend/README.md)，[算法](./algorithm/README.md)，
