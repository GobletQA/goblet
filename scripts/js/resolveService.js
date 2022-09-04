/**
 * Used by devspace in the devspace.yml to dynamically generate an service config including exposed ports
 * Builds port mapping when arg contains <exposedPort>:<containerPort>
 * Otherwise the containerPort is not included
 * Run command below to test
 * `node ../scripts/js/resolveService.js goblet-dind 2375 2122 2121 2123 2018:2019`
 */
 
const { exists } = require('@keg-hub/jsutils')

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

;(() => {
    const [
    deployment,
    ...srvPorts
  ] = process.argv.slice(2)
  
  const name = buildServiceName(deployment)
  const ports = buildPorts(srvPorts)

process.stdout.write(`
${name}
ports:
${ports}
`)


})()