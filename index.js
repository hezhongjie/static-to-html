let fs = require('fs');
let path = require('path');

console.log('start...');

let initConfig = {
  buildCommander:'vue-cli-service build', // 暂时无用
  dist: './dist',
  input: './dist/index.html', // 
  output: './dist/index.html', // 输出的文件
  srcReg: [
    /app\.[0-9a-w]+\.(?:js|css)/,
    /chunk-vendors\.[0-9a-w]+\.(?:js)/,
  ],
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

let { dist, input,output, srcReg } = fileConfig;
let htmlStr = '';

try {
  htmlStr = fs.readFileSync(path.resolve(input)).toString();
} catch (error) {
  throw new Error('can not read index.html!');
}

// 获取需要替换的的link和script标签的src，
console.log('all regExp:', srcReg);

let linkOrScript = [];
htmlStr = htmlStr.replace(/<(link|script)\b[^>]+(\/?>|><\0>)/gi, function (args) {
  let paths = args.match(/\s(?:src|href)=('|")?([^\s>]+)\1/);
  if (paths && paths[2]) {
    // let src = paths[2].replace(/^\//, '');
    let src = paths[2];
    if (src && srcReg.some(reg => reg.test(src))) {
      linkOrScript.push(src);
      return '';
    }
  }
  return args;
})
linkOrScript = new Set(linkOrScript);

console.log('these files will be appended:');
console.log(linkOrScript);

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

htmlStr = htmlStr.replace(/<\/head>|<\/html>/g, function (args) {
  if (args === '</head>') {
    return content.css + '</head>';
  } else if (args === '</html>') {
    return content.js + '</html>';
  }
  return args;
});

let newHtml = path.resolve(output);
// fs.writeFile(path.resolve(html), htmlStr, function (err) {

console.log('New html file is creating:', newHtml);

fs.writeFile(newHtml, htmlStr, function (err) {
  if (err) {
    console.warning(err);
  } else {
    console.log('Static code append html success!')
  }
})