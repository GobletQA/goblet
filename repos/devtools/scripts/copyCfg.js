const path = require('path')
const { promises:fs } = require('fs')

const rootDir = path.join(__dirname, `../`)
const cfgLoc = path.join(rootDir, `configs/serve.json`)
const cfgToLoc = path.join(rootDir, `public/serve.json`)

const pathExists = async (loc) => {
  try {
    await fs.access(loc, fs.constants.F_OK)
    return [undefined, true]
  }
  catch(err) {
    return [err, undefined]
  }
}

;(async () => {
  const [__, exists] = await pathExists(cfgToLoc)
  if(exists) return console.log(`[Devtools] Skipping server config copy, config file already exists`)

  console.log(`[Devtools] Copy serve.json info public directory...`)
  await fs.cp(cfgLoc, cfgToLoc)
  console.log(`[Devtools] Copy devtools success`)
})()
