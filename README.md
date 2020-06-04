# static-to-html
简介：将特定的css,js文件内容打包进目标html文件

### 解决问题
vue或react的单页面项目，首页加载慢会导致白屏的问题，使用ssr难度较高，如果把首页的js,css文件内容直接打包进index.html,是可以减少首屏加载时间，并且实施很简单。

### 测试效果
加载时间由 2.6s 缩减为 1.7s;
根据本地测试结果，正常的单页面项目的首页load时间一般为2.6s左右，用此方法优化后，时间缩短至1.7s,所有还是有一定帮助的。

### 使用方法
1. 一个正常的vue或react单页面项目

2. 安装包
```shell
npm install --save-dev static-to-html
```

3. 创建配置文件：static.config.js,在项目的根目录。可以是一个对象或者一个返回对象的方法(参考文件：static.config.js)

 参数 | descript |类型| 默认值
-------|------ | ------|-----------------
 dist string |打包生成的目录| String |./dist
 htmls|需要处理的html文件配置|[]{}|
 input|需要处理的html文件|String|./dist/index.html
 output|生成的html文件|String|./dist/index.html
 srcReg|需要处理的静态文件|[]RegExg | /app\.[0-9a-w]+\.(?:js|css)/,/chunk-vendors\.[0-9a-w]+\.(?:js)/,


4. 执行命令:需已经打包成功，生成了dist文件夹;或者使用串联命令

```node
node ./node_modules/static-to-html/index.js

```
5. 新增命令行：如果额外执行一次命令较麻烦，可以合并命令
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

