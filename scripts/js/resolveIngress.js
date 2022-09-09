/**
 * Used by devspace in the devspace.yml to dynamically generate a full ingress config object
 * Includes tls config when a cert-issuer env is found
 * Run the following command to test
 * node scripts/js/resolveIngress.js BE goblet-backend 7005 "*"
 */
 
const { resolveHost, resolveValues, resolveValue } = require('./resolveValues')

const buildIngressName = (deployment) => (`name: ${deployment}-ingress`)

/**
 * Adds annotations needed for generating ssl certs via the certs helm chart
 * When testing, add the annotation
 *  - acme.kubernetes.io/staging: "true"
 * This tells the certs pod to use the letsencrypt staging server, so we don't get rate-limited
 */
const buildTls = ({
  email,
  tls=true,
}) => (`
tls: ${tls}
disableCertManager: true
labels:
annotations:
  acme.kubernetes.io/enable: "true"
  acme.kubernetes.io/staging: "false"
  acme.kubernetes.io/dns: "dns_linode_v4"
  acme.kubernetes.io/add-args: "--dnssleep 120"
  acme.kubernetes.io/pre-cmd: "acme.sh --register-account -m ${email}"
  nginx.ingress.kubernetes.io/proxy-connect-timeout: "3600"
  nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
  nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
  nginx.ingress.kubernetes.io/configuration-snippet: |
    add_header 'Access-Control-Allow-Origin' '*' always;
    more_set_headers "X-Goblet-Host: $http_x_goblet_host";
    more_set_headers "X-Goblet-Port: $http_x_goblet_port";
    more_set_headers "X-Goblet-Proto: $http_x_goblet_proto";
    more_set_headers "X-Goblet-Subdomain: $http_x_goblet_subdomain";
`)


const buildRule = (host, serviceName, servicePort, path=`/`, type=`ImplementationSpecific`) => (`
- host: "${host}"
  serviceName: ${serviceName}
  servicePort: ${servicePort}
  path: ${path}
  pathType: ${type}
`)


const getSubdomainsRules = (host, deployment, mainPort, subdomains, options) => {
  return subdomains.length &&
    subdomains.map(item => {
      const [sub, port] = item.includes(`:`)
        ? item.split(`:`)
        : [item, mainPort]

      return !options || !options.length
        ? buildRule(`${sub}.${host}`, deployment, port)
        : options.map(opt => buildRule(`${sub}.${host}`, deployment, port, opt.path, opt.type)).join(`\n`)

    }).join(`\n`) || ``
}

const buildOptions = (item) => {
  const  [path, type] = item.split(`:`)
  return {path, type}
}

const parseOptions = (args) => {
  return args.reduce((acc, item) => {
    item.includes(`:`)
      ? acc.options.push(buildOptions(item))
      : acc.subdomains.push(item)
    
    return acc
  }, { subdomains: [], options: [] })
}

const buildRules = (host, deployment, port, options) => {
  const builtRules = !options || !options.length
    ? buildRule(host, deployment, port)
    : options.map(opt => buildRule(host, deployment, port, opt.path, opt.type)).join(`\n`)

  return `rules:${builtRules}`
}

const buildTlsRules = ({
  port,
  host,
  email,
  tls=true,
  deployment,
  options
}) => (`
${buildTls({ email, tls }).trim()}
${buildRules(host, deployment, port, options).trim()}
`)

;(async () => {
  const [
    prefix,
    port,
    ...args
  ] = process.argv.slice(2)

  const { subdomains, options } = parseOptions(args)
  const values = resolveValues()
  const deployment = resolveValue(`GB_${prefix}_DEPLOYMENT`, values)

  if(!prefix || !deployment) return

  const host = resolveHost(prefix, values)
  const tls = resolveValue(`GB_${prefix}_SECRET_TLS_NAME`, values)
  const email = resolveValue(`GB_CR_USER_EMAIL`, values)

  const name = buildIngressName(deployment)
  const subRules = getSubdomainsRules(host, deployment, port, subdomains, options)
  const rules = !tls
    ? buildRules(host, deployment, port, options)
    : buildTlsRules({
        tls,
        host,
        port,
        email,
        deployment,
        options
      })

process.stdout.write(`
${name.trim()}
${rules.trim()}
${subRules.trim()}
`)

})()



