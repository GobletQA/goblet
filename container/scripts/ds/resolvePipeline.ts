/**
 * Used by devspace in the devspace.yml to generate pipeline steps that are used to start the app
 * Ensures only deployed apps actually get started
 */

import { getEnvPrefix, resolveValue } from './resolveValues'
const ePreFix = getEnvPrefix()

const pipelineMethods = {
  [`goblet-backend`]: ` start-be `,
  [`goblet-screencast`]: ` start-sc `,
  [`goblet-action`]: ` start-act `,
}

const pipelines = () => {
  const slice:string[] = process.argv.slice(2)
  if (!slice.length)
    return ''

  const isDevMode = resolveValue(`${ePreFix}LOCAL_DEV_MODE`)

  const services = slice.reduce((acc:string, prefix:string) => {
    if(!isDevMode && prefix !== `BE`) return acc

    const envPrefix = `${ePreFix}${prefix}`
    const deployment = process.env[`${envPrefix}_ACTIVE`]
    acc += deployment ? pipelineMethods[deployment] : ``

    return acc
  }, ``)

  return services.length ? services : ``

}

process.stdout.write(pipelines())
