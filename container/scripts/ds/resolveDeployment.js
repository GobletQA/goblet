
/**
 * Used by devspace in the devspace.yml to generate a deployment matching the yaml spec
 */
const { resolveValues, getEnvPrefix } = require('./resolveValues')
const ePreFix = getEnvPrefix()

const values = resolveValues()
const getEnvValue = (key, fallback) => {
  return process.env[key] || values[key] || fallback
}

const getRepo = (deployment) => {
  return deployment.split('-').pop().toLowerCase()
}

const resolveIngress = (deployment) => {
  if(!deployment) return

  const subDomain = getEnvValue(`${ePreFix}SUB_DOMAIN`)
  const hostDomain = getEnvValue(`${ePreFix}HOST_DOMAIN`)

  /**
   * Build the ingress host based on the host and sub domains
   */
  return hostDomain && subDomain
    ? `${subDomain}-${getRepo(deployment)}.${hostDomain}`
    : `${deployment.replace('_', '-')}.localhost`

}


const buildDeployment = (
  deployment,
  nodeEnv,
  imageWTag,
  pullPolicy,
  npmToken,
  nmInstall,
  port,
) => (`
${deployment}
  helm:
    chart:
      name: ./
    cleanupOnFail: true
    valuesFiles:
    - ./values.yml
    - ./values.${nodeEnv}.yml
    values:
      containers:
      - image: "${imageWTag}"
        imagePullPolicy: ${pullPolicy}
        env:
        - name: NPM_TOKEN
          value: ${npmToken}
        - name: NODE_ENV
          value: ${nodeEnv}
        - name: ${ePreFix}SUB_REPO
          value: ${getRepo(deployment)}
        - name: ${ePreFix}NM_INSTALL
          value: ${nmInstall}
      service:
        name: ${deployment}
        ports:
        - port: ${port}
      ingress:
        name: ${deployment}-ingress
        annotations:
          kubernetes.io/ingress.class: ambassador
        rules:
        - host: ${resolveIngress(deployment)}
          serviceName: ${deployment}
          servicePort: ${port}
`)


const args = process.argv.slice(2)
const prefix = args.shift().toUpperCase()
const pullPolicy = args.shift()
const npmToken = args.shift()
const nmInstall = args.shift()

const deploy = buildDeployment(
  getEnvValue(`${ePreFix}${prefix}_DEPLOYMENT`),
  getEnvValue(`NODE_ENV`, 'local'),
  getEnvValue(`${ePreFix}${prefix}_IMG_URI`),
  pullPolicy,
  npmToken,
  nmInstall,
  getEnvValue(`${ePreFix}${prefix}_PORT`),
)

process.stdout.write(deploy)
