const path = require('path')
const { promises:fs } = require('fs')

const publicDir = path.join(__dirname, `../public`)

;(async () => {
  console.log(`[Devtools] Removing public directory`)
  await fs.rm(publicDir, { recursive: true, force: true })
  console.log(`[Devtools] Public directory removed successfully`)
})()
