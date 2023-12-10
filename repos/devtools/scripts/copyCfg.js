const path = require('path')
const { promises:fs } = require('fs')

const rootDir = path.join(__dirname, `../`)
const cfgLoc = path.join(rootDir, `configs/serve.json`)
const cfgToLoc = path.join(rootDir, `public/serve.json`)

;(async () => {
  console.log(`[Devtools] Copy serve.json info public directory...`)
  await fs.cp(cfgLoc, cfgToLoc)
  console.log(`[Devtools] Copy devtools success`)
})()
