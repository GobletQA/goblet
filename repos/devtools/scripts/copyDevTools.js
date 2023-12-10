const path = require('path')
const { promises:fs } = require('fs')

const rootDir = path.join(__dirname, `../`)
const copyToLoc = path.join(rootDir, `public`)
const devtoolsLoc = path.join(rootDir, `node_modules`, `@ltipton/chrome-devtools/public`)

const pathExists = async (loc) => {
  try {
    await promises.access(loc, promises.constants.F_OK)
    return [undefined, true]
  }
  catch(err) {
    return [err, undefined]
  }
}


;(async () => {
  const [__, exists] = await pathExists(copyToLoc)
  if(exists) return console.log(`[Devtools] Skipping devtools copy, public directory already exists`)

  console.log(`[Devtools] Copy devtools from node_modules to public directory...`)
  await fs.cp(devtoolsLoc, copyToLoc, { dereference: true, force: true, recursive: true })
  console.log(`[Devtools] Copy devtools success`)
})()
