require('source-map-support').install({ environment: 'node' })
import { docker } from '@keg-hub/cli-utils'
import { conductorConfig } from '@GBE/Configs/conductor.config'
import { Logger, setupLogger } from '@gobletqa/shared/libs/logger'
import { buildImgUri } from '@gobletqa/conductor/controller/docker/image/buildImgUri'
const { GB_CD_CONTROLLER_TYPE }  = process.env

setupLogger({ tag: `Goblet BE` })

;(async () => {
  if((GB_CD_CONTROLLER_TYPE || ``).toLowerCase() !== `docker`) return

  Logger.info(`Starting images pull....`)

  Object.entries(conductorConfig.images)
    .reduce(async (toResolve, [name, image]) => {
      await toResolve

      const intervalID = setInterval(() => {
        Logger.info(`still pulling ${name}...`)
      }, 5000)

      try {
        await toResolve
        const imageUri = buildImgUri(image)
        Logger.info(`Pulling image ${name} from ${imageUri}...`)

        const { error, data, exitCode } = await docker(
          [`pull`, imageUri],
          { envs: process.env, exec: true }
        )
        if(error) throw new Error(error)

        Logger.log(data)
        Logger.success(`Image ${name} pulled successfully`)

      }
      catch(err){
        Logger.error(`Image ${name} pull failed`)
        Logger.log(err.stack)
      }
      finally {
        clearInterval(intervalID)
      }

    }, Promise.resolve())

})()

