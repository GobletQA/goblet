/**
 * Used by devspace in the devspace.yml to dynamically generate an service config including exposed ports
 * Builds port mapping when arg contains <exposedPort>:<containerPort>
 * Otherwise the containerPort is not included
 * Run command below to test
 * `node container/container/scripts/ds/resolveService.js goblet-backend 7005 19011`
 */
 const { resolveValues, resolveValue, getEnvPrefix } = require('./resolveValues')
 const ePreFix = getEnvPrefix()
 
const { exists } = require('@keg-hub/jsutils/exists')

const buildServiceName = (deployment) => (`
name: ${deployment}
`)

// containerPort:
const buildPorts = (ports) => (
  ports.map(item => {
    if(!exists(item)) return ``

    const [port, cPort] = item.includes(`:`) ? item.split(`:`) : [item]
    let built = [`- port: ${port}`]
    cPort && built.push(`  containerPort: ${cPort}`)

    return built.join(`\n`)
  }).filter(Boolean).join(`\n`)
)


const buildTlsAnnotations = (secret) => (`
annotations:
  service.beta.kubernetes.io/linode-loadbalancer-default-protocol: http
  service.beta.kubernetes.io/linode-loadbalancer-port-443: '{"tls-secret-name": "${secret}", "protocol": "https"}'
`)

;(() => {
  const [
    prefix,
    ...srvPorts
  ] = process.argv.slice(2)
  
  const ports = buildPorts(srvPorts)

  const values = resolveValues()

  const deployment = resolveValue(`${ePreFix}${prefix}_DEPLOYMENT`, values)
  const name = buildServiceName(deployment)

  const secret = resolveValue(`${ePreFix}${prefix}_SECRET_TLS_NAME`, values)
  const annotations = secret ? buildTlsAnnotations(secret) : ``

process.stdout.write(`
${name}
${annotations}
ports:
${ports}
`)


})()