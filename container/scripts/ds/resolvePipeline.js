/**
 * Used by devspace in the devspace.yml to generate pipeline steps that are used to start the app
 * Ensures only deployed apps actually get started
 */

const { getEnvPrefix } = require('./resolveValues')
const ePreFix = getEnvPrefix()


const pipelineMethods = {
  [`goblet-backend`]: ` start-be `,
  [`goblet-screencast`]: ` start-sc `,
}

const pipelines = () => {
  const slice =  process.argv.slice(2)
  if (!slice.length)
    return ''

  const services = slice.reduce((acc, prefix) => {
    const envPrefix = `${ePreFix}${prefix}`
    const deployment = process.env[`${envPrefix}_ACTIVE`]
    acc += deployment ? pipelineMethods[deployment] : ``

    return acc
  }, ``)

  return services.length ? services : ``

}

process.stdout.write(pipelines())
