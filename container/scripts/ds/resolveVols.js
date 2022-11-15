
const { resolveValues, getEnvPrefix } = require('./resolveValues')
const ePreFix = getEnvPrefix()

const getDinDMounts = () => (`
- containerPath: /etc/docker/certs.d
  volume:
    name: docker-server
    readOnly: false
`)

const getDinDVols = () => (`
- name: docker-server
  secret:
    secretName: docker-server
    items:
    - key: certificate
      path: certificate.pem
    - key: server-key
      path: server-key.pem
    - key: ca-public
      path: ca-public.pem
`)

const getVolumeMounts = (repo, volumeMounts) => {
  switch(repo){
    case 'dind': 
      return volumeMounts ? getDinDMounts() : getDinDVols()
    default:
      return ``
  }
}

const [repo, volumeMounts] = process.argv.slice(2)
const envs = resolveValues()

const dockerPort = envs[`${ePreFix}DD_DOCKER_PORT`]
const isSecure = dockerPort === `2376` && !Boolean(envs[`${ePreFix}LOCAL_DEV_MODE`])

const volumes = isSecure
  ? getVolumeMounts(repo, Boolean(volumeMounts))
  : ``

process.stdout.write(volumes)
