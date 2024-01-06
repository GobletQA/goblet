module.exports = {
  ...require('@gobletqa/configs/eslintrc.config.js'),

  /* ---- Repo specific options here ---- */
  parserOptions: {
    project: 'tsconfig.eslint.json',
    tsconfigRootDir: require('path').join(__dirname, '../'),
  },
}
