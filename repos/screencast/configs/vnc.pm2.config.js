const path = require('path')

const scRoot = path.join(__dirname, `../`)
const logDir = path.join(__dirname, `../../../logs`)

module.exports = {
  apps : [
    {
      args: 'vnc',
      name: `vnc`,
      out_file: path.join(logDir, `vnc.out.log`),
      error_file: path.join(logDir, `vnc.err.log`),
      script : path.join(scRoot, `dist/vnc.js`),
    },
    {
      args: 'sock',
      name: `sockify`,
      out_file: path.join(logDir, `sockify.out.log`),
      error_file: path.join(logDir, `sockify.err.log`),
      script : path.join(scRoot, `dist/vnc.js`),
    }
  ]
}