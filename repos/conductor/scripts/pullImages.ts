require('source-map-support').install({ environment: 'node' })
import { Conductor } from '../'
import { Logger } from '@GCD/utils/logger'
import { appConfig } from '@gobletqa/conductor/configs/app.config'

;(async () => {
  
  Logger.info(`Starting images pull....`)
  
  const conductor = new Conductor(appConfig)
  await conductor.start()

  Object.keys(appConfig.images)
    .reduce(async (toResolve, key) => {
      try {
        await toResolve
        Logger.info(`Pulling image ${key}...`)
        await conductor.pull(key)
        Logger.success(`Image ${key} pulled successfully`)
      }
      catch(err){
        Logger.error(`Image ${key} pull failed`)
        Logger.log(err.stack)
      }
    }, Promise.resolve())

})()

