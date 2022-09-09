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
  acme.kubernetes.io/pre-cmd: "acme.sh --register-account -m ${email}"
  acme.kubernetes.io/add-args: "--dnssleep 120"
  nginx.ingress.kubernetes.io/proxy-connect-timeout: "3600"
  nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
  nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
  nginx.ingress.kubernetes.io/configuration-snippet: |
    more_set_headers "X-Goblet-Host: $http_x_goblet_host";
    more_set_headers "X-Goblet-Port: $http_x_goblet_port";
    more_set_headers "X-Goblet-Proto: $http_x_goblet_proto";
    more_set_headers "X-Goblet-Subdomain: $http_x_goblet_subdomain";

  nginx.ingress.kubernetes.io/server-snippets: |
    location ~* "^/sockr-socket" {
      proxy_http_version 1.1;

      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $connection_upgrade;

      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Forwarded-Host $http_host;
      proxy_set_header X-Forwarded-For $remote_addr;

      proxy_socket_keepalive on;
    }
    location ~* "/novnc" {
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $connection_upgrade;

      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Forwarded-Host $http_host;
      proxy_set_header X-Forwarded-For $remote_addr;

      proxy_socket_keepalive on;
    }
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

const buildTlsRules = ({
  port,
  host,
  email,
  tls=true,
  deployment,
}) => (`
${buildTls({ email, tls }).trim()}
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
  const tls = resolveValue(`GB_${prefix}_SECRET_TLS_NAME`, values)
  const email = resolveValue(`GB_CR_USER_EMAIL`, values)

  const name = buildIngressName(deployment)
  const subRules = getSubdomainsRules(host, deployment, port, subdomains)
  const rules = !tls
    ? buildRules(host, deployment, port)
    : buildTlsRules({
        tls,
        host,
        port,
        email,
        deployment,
      })

process.stdout.write(`
${name.trim()}
${rules.trim()}
${subRules.trim()}
`)

})()



