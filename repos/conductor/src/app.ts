require('source-map-support').install({ environment: 'node' })
import { Conductor } from './index'
import { appConfig } from '@gobletqa/conductor/configs/app.config'

;(async () => {
  const conductor = new Conductor(appConfig)
  await conductor.start()

  // TODO: figure out how to make this only happen once during development ???
  // Object.keys(appConfig.images)
  //   .reduce(async (toResolve, key) => {
  //     await toResolve
  //     const { data } = await conductor.pull(key)
  //   }, Promise.resolve())

})()

