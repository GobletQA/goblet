/**
 * Used by devspace in the devspace.yml to dynamically generate a full ingress config object
 * Includes tls config when a cert-issuer env is found
 * Run the following command to test
 * node scripts/js/resolveIngress.js BE goblet-backend 7005 "*"
 */
 
const { resolveHost, resolveValues, resolveValue } = require('./resolveValues')

const buildIngressName = (deployment) => (`name: ${deployment}-ingress`)


const buildTls = (issuer, tlsName=true, type=`nginx`) => (`
tls: ${tlsName}
tlsClusterIssuer: ${issuer}
annotations:
  kubernetes.io/ingress.class: "${type}"
  cert-manager.io/cluster-issuer: "${issuer}"
`)

const buildRule = (host, serviceName, servicePort) => (`
- host: "${host}"
  serviceName: ${serviceName}
  servicePort: ${servicePort}
`)

const getSubdomainsRules = (host, deployment, mainPort, subdomains) => {
  return subdomains.length &&
    subdomains.map(item => {
      const [sub, port] = item.includes(`:`)
        ? item.split(`:`)
        : [item, mainPort]

      return buildRule(`${sub}.${host}`, deployment, port)
    }).join(`\n`) || ``
}

const buildRules = (host, deployment, port) => (`rules:${buildRule(host, deployment, port)}`)

const buildTlsRules = (issuer, tlsName=true, host, deployment, port) => (`
${buildTls(issuer, tlsName).trim()}
${buildRules(host, deployment, port).trim()}
`)

;(async () => {
  const [
    prefix,
    deployment,
    port,
    ...subdomains
  ] = process.argv.slice(2)

  if(!prefix || !deployment) return

  const values = resolveValues()
  const host = resolveHost(prefix, values)
  const issuer = resolveValue(`GB_${prefix}_CERT_ISSUER`, values)
  const tlsName = resolveValue(`GB_${prefix}_SECRET_TLS_NAME`, values)

  const name = buildIngressName(deployment)
  const subRules = getSubdomainsRules(host, deployment, port, subdomains)
  const rules = issuer
    ? buildTlsRules(issuer, tlsName, host, deployment, port)
    : buildRules(host, deployment, port)

process.stdout.write(`
${name.trim()}
${rules.trim()}
${subRules.trim()}
`)

})()



