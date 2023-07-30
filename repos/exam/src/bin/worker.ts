import type { MessagePort } from 'worker_threads'
import type { TExamConfig, TExamRunOpts } from '@GEX/types'

import { Exam } from '../Exam'
import { limbo, ife } from '@keg-hub/jsutils'
import {updateCLIEnvs} from '@GEX/bin/helpers'
import { parentPort, workerData } from 'worker_threads'

type TWorkerCfg = {
  id:string
  exam:TExamConfig
}

type TParentMsg = {
  port:MessagePort
  run:TExamRunOpts
}


ife(async () => {

  const workerCfg:TWorkerCfg = {
    exam: workerData.exam,
    id: workerData.workerId
  }

  updateCLIEnvs(
    workerCfg.exam,
    { 
      workerId: workerCfg.id,
      logLevel: workerData.logLevel || `info`
    }
  )

  parentPort.on('message', async (message:TParentMsg) => {

    /**
    * Create a new exam instance each time the worker is rerun
    * This ensures a clean environment each time
    */
    const EX = new Exam(workerCfg.exam, workerCfg.id)
    const [error, results] = await limbo(EX.run(message.run))

    if(error){
      // TODO: figure out how to handle an error
      console.log(error)
    }

    message.port.postMessage(results)
  })

})


