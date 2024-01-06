const path = require('path')
const { existsSync } = require('fs')

let GobletRoot

try {
  if(process.env.KUBERNETES_SERVICE_HOST) GobletRoot = `/goblet/app`
  else {
    const mod = require('@gobletqa/root/gobletRoot')
    GobletRoot = mod.GobletRoot
  }
}
catch(err){
  const root = path.join(__dirname, `../gobletRoot`)

  if(!existsSync(`${root}.js`)) throw err
  const mod = require(root)
  GobletRoot = mod.GobletRoot
}

module.exports = {
  GobletRoot
}
