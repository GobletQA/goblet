require('source-map-support').install({ environment: 'node' })
import { Conductor } from '@gobletqa/conductor'
import { createProxy } from '@gobletqa/conductor/proxy'
import { createServer } from '@gobletqa/conductor/server'
import { appConfig } from '@gobletqa/conductor/configs/app.config'

;(async () => {

  const conductor = new Conductor(appConfig)
  await conductor.start()
  
  const { server } = createServer(
    conductor.config.server,
    conductor.config?.localDevMode
  )

  const proxyHandler = createProxy({
    ...conductor.config.proxy,
    proxyRouter: conductor.proxyRouter.bind(conductor)
  })

  server.on('upgrade', proxyHandler.upgrade)

})()

