import type { MessagePort } from 'worker_threads'
import type { TExamConfig, TExamRunOpts } from '@GEX/types'

import { ife } from '@keg-hub/jsutils/ife'
import {updateCLIEnvs} from '@GEX/bin/helpers'
import { WorkerEvents } from '@GEX/constants/worker'
import { RunPipeline } from '../pipelines/RunPipeline'
import { parentPort, workerData } from 'worker_threads'
import { onStartupStep } from '../pipelines/steps/onStartupStep'
import { onShutdownStep } from '../pipelines/steps/onShutdownStep'


type TWorkerCfg = {
  id:string
  exam:TExamConfig
}

type TParentMsg = {
  port:MessagePort
  run:TExamRunOpts
  event?:string
  terminate?:boolean
}

ife(async () => {


  const workerCfg:TWorkerCfg = {
    exam: workerData.exam,
    id: workerData.workerId
  }

  updateCLIEnvs(workerCfg.exam, { 
    workerId: workerCfg.id,
    logLevel: workerData.logLevel || `info`
  })

  workerCfg.exam?.onStartup?.length
    && await onStartupStep({
        cli:true,
        config: workerCfg.exam,
        id: workerData.workerId,
      })

  parentPort.on('message', async (message:TParentMsg) => {

    /**
     * Listen for terminate events, and gracefully shutdown the worker
     */
    if(message.terminate || message.event === WorkerEvents.Terminate){
      workerCfg.exam?.onShutdown?.length
        && await onShutdownStep({
            cli:true,
            config: workerCfg.exam,
            id: workerData.workerId,
          })

      return process.exit(0)
    }

    /**
    * Create a new exam instance each time the worker is rerun
    * This ensures a clean environment each time
    */
    const results = await RunPipeline({
      cli:true,
      ...message.run,
      config: workerCfg.exam,
      id: workerData.workerId,
    })

    message.port.postMessage(results)

  })

})


