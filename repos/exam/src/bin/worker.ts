import type { MessagePort } from 'worker_threads'
import type { TExamConfig, TExamRunOpts } from '@GEX/types'

import { Exam } from '../Exam'
import { ife } from '@keg-hub/jsutils'
import { RunPipeline } from '../pipelines'
import {updateCLIEnvs} from '@GEX/bin/helpers'
import { WorkerEvents } from '@GEX/constants/worker'
import { parentPort, workerData } from 'worker_threads'



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

  let EX:Exam

  const workerCfg:TWorkerCfg = {
    exam: workerData.exam,
    id: workerData.workerId
  }

  updateCLIEnvs(workerCfg.exam, { 
    workerId: workerCfg.id,
    logLevel: workerData.logLevel || `info`
  })

  parentPort.on('message', async (message:TParentMsg) => {

    /**
     * Listen for terminate events, and gracefully shutdown the worker
     */
    if(message.terminate || message.event === WorkerEvents.Terminate){
      EX && await EX.cancel()
      return process.exit(0)
    }

    /**
    * Create a new exam instance each time the worker is rerun
    * This ensures a clean environment each time
    */
    // EX = new Exam(workerCfg.exam, workerCfg.id)
    const results = await RunPipeline({
      cli:true,
      ...message.run,
      config: workerCfg.exam,
      id: workerData.workerId,
    })

    message.port.postMessage(results)
    
    /**
     * Errors should be captured int the test results, so we don't want to throw here
     * This also ensures all test can continue running, even if one failed
    */
    
    // const [__, results] = await limbo<TExEventData[]>(EX.run(message.run))

    // EX = undefined

    // message.port.postMessage(results)
    // results?.forEach(result => {
    //   result?.failedExpectations?.forEach(exp => {
    //     if(exp.fullName !== EExErrorType.BailError) return
        
    //     console.log(`------- exp -------`)
    //     console.log(exp)

    //   })
    // })
  })

})


