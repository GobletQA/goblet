import "@GEX/utils/logger"
import { ife } from '@keg-hub/jsutils'
import { getConfig } from './getConfig'
import { initWorkers } from './initWorkers'
import { removeEmpty, parseArgs } from './helpers'

ife(async () => {

  const config = await parseArgs()
    .then(getConfig)
    .then(removeEmpty)

  await initWorkers(config)

})