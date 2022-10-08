const { resolveValue, ePreFix } = require('./resolveValues')
const ePreFix = getEnvPrefix()

;(async () => {
  const [ prefix ] = process.argv.slice(2)
  if(!prefix) return

  const value = resolveValue(`${ePreFix}${prefix}_PRIVILEGED`)

value && process.stdout.write(`
privileged: ${value}
`)

})()