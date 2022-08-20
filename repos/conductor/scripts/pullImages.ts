require('source-map-support').install({ environment: 'node' })
import { docker } from '@keg-hub/cli-utils'
import { Logger } from '@GCD/utils/logger'
import { buildImgUri } from '@GCD/utils/buildImgUri'
import { appConfig } from '@gobletqa/conductor/configs/app.config'

;(async () => {
  Logger.info(`Starting images pull....`)

  Object.entries(appConfig.images)
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
