
const { resolveValues, getEnvPrefix } = require('./resolveValues')
const ePreFix = getEnvPrefix()


const getVolumeMounts = (repo, volumeMounts) => {
  switch(repo){
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
