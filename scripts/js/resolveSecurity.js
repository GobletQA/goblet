const { resolveValue } = require('./resolveValues')

;(async () => {
  const [ prefix ] = process.argv.slice(2)
  if(!prefix) return

  const value = resolveValue(`GB_${prefix}_PRIVILEGED`)

value && process.stdout.write(`
privileged: ${value}
`)

})()