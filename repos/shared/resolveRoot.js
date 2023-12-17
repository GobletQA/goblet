const path = require('path')

const subRepos = [
  `repos/backend`,
  `repos/browser`,
  `repos/components`,
  `repos/conductor`,
  `repos/screencast`,
  `repos/exam`,
  `repos/latent`,
  `repos/monaco`,
  `repos/race`,
  `repos/testify`,
  `repos/vite`,
  `repos/workflows`,
]

const checkRepoLoc = (repo, loc) => {
  if(repo && loc && __dirname.includes(`${repo}/${loc}`)){
    const start = __dirname.split(`${repo}/${loc}`).shift()
    return path.join(start, repo)
  }

  return false
}

const checkBuildLoc = (loc) => {
  if(__dirname.includes(`/${loc}`)){
    const distArr = __dirname.split(`/${loc}`)
    distArr.pop()
    return distArr.join(`/${loc}`)
  }

  return false
}


/**
 * Will be needed when the package is bundled
 * Still needs to be figured out
 * So for now just return __dirname
 */
const resolveRoot = () => {
  const found = subRepos.reduce((loc, repo) => {
    return loc
      || checkRepoLoc(repo, `dist`)
      || checkRepoLoc(repo, `build`)
      || loc
  }, false)

  return typeof found === `string`
    ? found
    : checkBuildLoc(`dist`)
      || checkBuildLoc(`build`)
      || __dirname
}

module.exports = {
  GSHRoot: resolveRoot()
}