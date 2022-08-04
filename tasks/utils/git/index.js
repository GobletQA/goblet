module.exports = {
  ...require('./commitGitChanges'),
  ...require('./getGitModified'),
  ...require('./getGitStagedFiles'),
  ...require('./git'),
}
