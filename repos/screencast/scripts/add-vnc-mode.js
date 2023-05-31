// apt-get update && apt-get install --yes --no-install-recommends x11-xserver-utils
// /usr/bin/Xtigervnc -SecurityTypes None -geometry 1167x1214x24 -rfbport 26370 -alwaysshared :0

// /usr/bin/Xtigervnc -SecurityTypes None -geometry 1615x1430x24 -rfbport 26370 -alwaysshared :0
// /usr/bin/Xtigervnc -SecurityTypes None -geometry 1615x1430x24 -rfbport 26370 -alwaysshared :0


const { execSync } = require('child_process')

const REFRESH_RATE = 60

if (process.argv.length !== 3) {
  console.log(`Usage: node ${process.argv[1]} <geometry>`)
  process.exit(0)
}

const geometry = process.argv[2]
const [horz, vert] = geometry.split('x').map(Number)
const pixelFreq = (horz * vert * REFRESH_RATE) / 1.0e6
const display = 'VNC-0'

const mode = `${display}-${horz}-${vert}`
 
try { execSync(`xrandr --delmode ${display} ${mode}`) }
catch(err){}

try { execSync(`xrandr --rmmode ${mode}`) }
catch(err){}


execSync(`xrandr --newmode ${mode} ${pixelFreq} ${horz} 0 0 ${horz} ${vert} 0 0 0`)
execSync(`xrandr --addmode ${display} ${mode}`)
execSync(`xrandr --output ${display} --mode ${mode}`)

