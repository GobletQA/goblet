import type { MessagePort } from 'worker_threads'
import type { TExamConfig, TExamRunOpts } from '@GEX/types'

import { Exam } from '../Exam'
import {nanoid} from '@GEX/utils/nanoid'
import { limbo } from '@keg-hub/jsutils'
import { parentPort, workerData } from 'worker_threads'

type TInitWorkerData = {
  workerId:string
  exam:TExamConfig
}

type TParentMsg = {
  port:MessagePort
  run:TExamRunOpts
}

const onInit = (initData:TInitWorkerData) => {
  const config = initData.exam
  const workerId = initData.workerId || nanoid()
  process.env.EXAM_WORKER_ID = workerId

  return new Exam(config, workerId)
}

const EX = onInit(workerData)

const onMessage = async (message:TParentMsg) => {
  const [error, results] = await limbo(EX.run(message.run))

  if(error){
    // TODO: figure out how to handle an error
    console.log(error)
  }

  message.port.postMessage(results)
}

parentPort.once('message', onMessage)
