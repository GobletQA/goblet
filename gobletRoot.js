const path = require('path')
const { inDocker } = require('@keg-hub/jsutils/node/inDocker')

const subRepos = [
  `backend`,
  `conductor`,
  `environment`,
  `exam`,
  `git`,
  `goblet`,
  `latent`,
  `logger`,
  `repo`,
  `screencast`,
  `shared`,
  `testify`,
  `workflows`,
]

const resolveRoot = () => {

  if(inDocker()) return `/goblet/app`

  const { GOBLET_ROOT_DIR } = process.env
  if(GOBLET_ROOT_DIR) return GOBLET_ROOT_DIR
  
  const fileName = __filename.split(`/`).pop()
  if(fileName === `gobletRoot.js`) return __dirname

  const cwd = process.cwd()

  // Check if in caxa compiled variant
  if(process.env.GB_CAXA_COMPILED){
    return process.argv[2]
      ? path.join(process.argv[2], `dist`)
      : cwd.includes(`/dist/`)
        ? path.join(cwd.split(`/dist/`).shift(), `dist`)
        : __dirname
  }

  const found = subRepos.find(name => cwd.includes(`/repos/${name}`))
  if(found) return path.join(cwd.split(`/repos/${found}`).shift())

  // Check if there's a /repos in the path, and take the parent folder
  return cwd.includes(`/repos/`)
    ? path.join(cwd.split(`/repos/`).shift())
    : __dirname

}

module.exports = {
  GobletRoot: resolveRoot()
}