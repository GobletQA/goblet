require('source-map-support').install({ environment: 'node' })
import { Conductor } from '@gobletqa/conductor'
import { createProxy } from './proxy'
import { createServer } from './server'
import { appConfig } from '@gobletqa/conductor/configs/app.config'

;(async () => {

  const conductor = new Conductor(appConfig)
  await conductor.validate()
  
  const { server } = createServer(
    appConfig.server,
    appConfig?.localDevMode
  )

  const proxyHandler = createProxy({
    ...appConfig.proxy,
    proxyRouter: conductor.proxyRouter.bind(conductor)
  })

  server.on('upgrade', proxyHandler.upgrade)

})()

