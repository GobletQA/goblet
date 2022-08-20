
const { resolveValues } = require('./resolveValues')

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

const getConductorMounts = () => (`
- containerPath: /root
  volume:
    name: docker-client
`)

const getConductorDVols = () => (`
- name: docker-client
  secret:
    secretName: docker-client
    items:
    - key: client-certificate
      path: .docker/cert.pem
    - key: client-key
      path: .docker/key.pem
    - key: ca-public
      path: .docker/ca.pem
`)

const getVolumeMounts = (repo, volumeMounts) => {
  switch(repo){
    case 'dind': 
      return volumeMounts ? getDinDMounts() : getDinDVols()
    case 'conductor': 
      return volumeMounts ? getConductorMounts() : getConductorDVols()
    default:
      return ``
  }
}

const [repo, volumeMounts] = process.argv.slice(2)
const envs = resolveValues()
const isSecure = `${envs.GB_DD_DOCKER_PORT}` === `2376` && !Boolean(envs.GB_CD_LOCAL_DEV_MODE)

const volumes = isSecure
  ? getVolumeMounts(repo, Boolean(volumeMounts))
  : ``

process.stdout.write(volumes)
