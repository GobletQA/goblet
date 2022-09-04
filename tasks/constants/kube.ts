
export const CERT_CHART_NAME = `jetstack`
export const CERT_CHART_URL = `https://charts.jetstack.io`
export const CERT_REPO_URL = `https://github.com/cert-manager/cert-manager/releases/download/{{version}}/cert-manager.crds.yaml`

/**
 * Urls for interacting with letsencrypt and creating certs
 * Keys represent current NODE_ENV, which correspond to the correct letsencrypt url
 */
export const LETS_ENCRYPT_URLS = {
  production: `https://acme-v02.api.letsencrypt.org/directory`,
  staging: `https://acme-staging-v02.api.letsencrypt.org/directory`,
}

