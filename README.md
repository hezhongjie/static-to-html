# static-to-html
简介：将特定的css,js文件内容打包进目标html文件

## 解决问题
vue或react的单页面项目，首页加载慢会导致白屏的问题，使用ssr难度较高，如果把首页的js,css文件内容直接打包进index.html,是可以减少首屏加载时间，并且实施很简单。

## 测试效果
加载时间由 2.6s 缩减为 1.7s;
根据本地测试结果，正常的单页面项目的首页load时间一般为2.6s左右，用此方法优化后，时间缩短至1.7s,所有还是有一定帮助的。

## 使用方法
1. 一个正常的vue或react单页面项目

2. 安装包
```shell
npm install --save-dev static-to-html
```
3. 执行命令:需已经打包成功，生成了dist文件夹

```node
node ./node_modules/static-to-html/index.js

```
4. 新增命令行：如果额外执行一次命令较麻烦，可以合并命令
在package.json文件中的scripts下，新增一条自己的build命令,例如：
```json
{
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    // 上面一般是原有的命令，下面的为新增的命令
    "static":"vue-cli-service build && node ./node_modules/static-to-html/index.js"
  },

}

```

