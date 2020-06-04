let fs = require('fs');
let path = require('path');

console.log('start...');

let initConfig = {
  dist: './dist',
  htmls: [],
}, fileConfig = {};
const configPath = path.resolve('static.config.js');

if (fs.existsSync(configPath)) {
  try {
    fileConfig = require(configPath);
    if (typeof fileConfig === 'function') {
      fileConfig = fileConfig()
    }

    if (!fileConfig || typeof fileConfig !== 'object') {
      console.error(
        `Error loading static.config.js: should export an object or a function that returns object.`
      )
      fileConfig = null
    }
  } catch (e) {
    console.error(`Error loading ${chalk.bold('static.config.js')}:`);
    throw e;
  };
}

fileConfig = Object.assign({}, initConfig, fileConfig);
if (({}).toString.call(fileConfig.htmls) === '[object Object]') fileConfig.htmls = [fileConfig.htmls];

fileConfig.htmls.forEach(html => {
  let htmlStr = '';
  let { input, output, srcReg, dist = fileConfig.dist } = html;

  // 1.获取index.html文件
  try {
    htmlStr = fs.readFileSync(path.resolve(input)).toString();
  } catch (error) {
    throw new Error(`can not find ${input}!`);
  }

  // 2.获取需要替换的的link和script标签的src，
  console.log('静态资源匹配规则:', srcReg);
  let linkOrScript = [];
  htmlStr = htmlStr.replace(/<(link|script)\b[^>]+(\/?>|><\0>)/gi, function (args) {
    let paths = args.match(/\s(?:src|href)=('|")?([^\s>]+)\1/);
    if (paths && paths[2]) {
      let src = paths[2];
      if (src && srcReg.some(reg => reg.test(src))) {
        linkOrScript.push(src);
        return '';
      }
    }
    return args;
  })
  // 3.去重
  linkOrScript = [...new Set(linkOrScript)];

  console.log('these files will be appended to html:');
  console.log(linkOrScript);

  // 4. 将静态文件的内容分类型提取出来，并用对应的标签包裹好
  let content = { css: '', js: '', };
  linkOrScript.forEach(src => {
    let str = '';
    try {
      str = fs.readFileSync(path.resolve(dist, src)).toString();
    } catch (error) {
      console.warning('the file:' + src + '，can`t find');
    }

    if (/\.js$/.test(src)) {
      content.js += '<script>' + str + '</script>';
    } else if (/\.css$/.test(src)) {
      content.css += '<style>' + str + '</style>';
    }
  })

  // 5. 将内容插入html中
  htmlStr = htmlStr.replace(/<\/head>|<\/html>/g, function (args) {
    if (args === '</head>') {
      return content.css + '</head>';
    } else if (args === '</html>') {
      return content.js + '</html>';
    }
    return args;
  });

  // 6.创建新的html文件
  let newHtml = path.resolve(output);
  console.log(`${newHtml} is creating...`);

  fs.writeFile(newHtml, htmlStr, function (err) {
    if (err) {
      console.warning(err);
    } else {
      console.log('Static code had been appended to html successfully!')
    }
  })
})