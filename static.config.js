module.exports = {
  dist: './dist',
  htmls: [
    {
      dist: './dist',
      input: './dist/index.html',
      output: './dist/index2.html',
      srcReg: [
        /app\.[0-9a-w]+\.(?:js|css)/,
        /chunk-vendors\.[0-9a-w]+\.(?:js)/,
      ],
    }
  ],

}