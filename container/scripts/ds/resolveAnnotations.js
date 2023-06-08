/**
 * Used by resolveIngress script to build annotations for the ingress
 * Includes annotations when using the nginx-ingress with a websocket
 */

// TODO: these are duplicated in the repos/shared/src/helpers/setupCors.ts file
// Should have one source of truth
const allowedHeaders = [
  `X-PINGOTHER`,
  `Origin`,
  `X-Requested-With`,
  `Content-Type`,
  `Accept`,
  `Authorization`,
  `AuthToken`,
  `x-goblet-host`,
  `x-goblet-proto`,
  `x-goblet-port`,
  `x-goblet-route`,
  `x-goblet-subdomain`,
  `x-forwarded-subdomain`,
  `x-forwarded-port`,
  `x-forwarded-proto`,
  `x-forwarded-host`,
  `x-forwarded-for`
].join(`,`)

const allowedMethods = [
  `GET`,
  `POST`,
  `PUT`,
  `PATCH`,
  `DELETE`,
  `HEAD`,
  `OPTIONS`
].join(`,`)

/**
 * Adds annotations needed for generating ssl certs via the certs helm chart
 * When testing, add the annotation
 *  - acme.kubernetes.io/staging: "true"
 * This tells the certs pod to use the letsencrypt staging server, so we don't get rate-limited
 */
const sslAnnotations = (email) => (`
  acme.kubernetes.io/enable: "true"
  acme.kubernetes.io/staging: "false"
  acme.kubernetes.io/dns: "dns_linode_v4"
  acme.kubernetes.io/add-args: "--dnssleep 120"
  acme.kubernetes.io/pre-cmd: "acme.sh --register-account -m ${email}"
`)

const corsAnnotations = (origins) => (`
  nginx.ingress.kubernetes.io/enable-cors: "true"
  nginx.ingress.kubernetes.io/cors-allow-methods: "${allowedMethods}"
  nginx.ingress.kubernetes.io/cors-allow-headers: "${allowedHeaders}"
  nginx.ingress.kubernetes.io/cors-allow-origin: "${origins}"
`)

const proxyAnnotations = () => (`
  nginx.ingress.kubernetes.io/affinity: "cookie"
  nginx.ingress.kubernetes.io/affinity-mode: "persistent"
  nginx.ingress.kubernetes.io/proxy-body-size: "8m"
  nginx.ingress.kubernetes.io/proxy-connect-timeout: "75"
  nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
  nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
  nginx.ingress.kubernetes.io/proxy-redirect: "off"
  nginx.ingress.kubernetes.io/configuration-snippet: |
    more_set_headers "X-Goblet-Host: $http_x_goblet_host";
    more_set_headers "X-Goblet-Port: $http_x_goblet_port";
    more_set_headers "X-Goblet-Route: $http_x_goblet_route";
    more_set_headers "X-Goblet-Proto: $http_x_goblet_proto";
    more_set_headers "X-Goblet-Subdomain: $http_x_goblet_subdomain";

    proxy_set_header Authorization $http_authorization;
`)

    // proxy_set_header Upgrade $http_upgrade;
    // proxy_set_header Connection "Upgrade";
    // proxy_set_header Host $host;
/**
 * Helper method to parse a string of origins, and convert them to a cleaned array
 */
const generateOrigins = (originsStr=``) => {
  return (originsStr).split(',')
    .reduce((acc, origin) => {
      const host = (origin || '').trim()
      if(!host || acc.includes(host)) return acc

      const cleaned = host.replace(`https://`, '')
        .replace(`http://`, '')
        .replace(`wss://`, '')
        .replace(`ws://`, '')
      
      !acc.includes(cleaned) &&
        acc.push(
          `https://${cleaned}`,
          `http://${cleaned}`,
        )

      return acc
    }, [])
}

/**
 * Helper to generate all needed annotations for ssl cert and nginx proxy
 */
const resolveAnnotations = ({
  email,
  origins
}) => ([
  email && sslAnnotations(email),
  origins && corsAnnotations(origins),
  proxyAnnotations()
].filter(Boolean).join(`\n`))


module.exports = {
  generateOrigins,
  resolveAnnotations,
}