import type { TExamConfig } from '@GEX/types'

import { exists } from '@keg-hub/jsutils'
import { getCPUCount } from '@GEX/utils/getCPUCount'
import { printTooManyWorkers } from '@GEX/debug/verbose'

/** */
const getWorkerNum = (workers?:number, locationsAmt:number=1) => {
  const oneLessCpus = getCPUCount()

  let amount = workers > 0 ? workers : oneLessCpus > 0 ? oneLessCpus : 1
  
  if(amount > oneLessCpus){
    printTooManyWorkers(amount, oneLessCpus)
    amount = amount > oneLessCpus ? oneLessCpus : amount
  }

  /*** Only need to create as many workers as we have files to be tested */
  return amount > locationsAmt ? locationsAmt : amount
}

/**
 * Gets the number of jobs each worker can handle
 * Internally the worker also queues these jobs when running in serial
 */
const getConcurrency = (concurrency?:number, evenSplit?:number) => {
  return concurrency > 0 ? concurrency : evenSplit > 0 ? evenSplit : 1
}

const getWAndC = (exam:TExamConfig, locationsAmt:number) => {
  if(exam.runInBand) return { workers: 1, concurrency: 1 }

  const workers = getWorkerNum(exam.workers, locationsAmt)

  return {
    workers,
    concurrency: getConcurrency(exam.concurrency, Math.floor(locationsAmt / workers))
  }
}

/**
 * Split an array of items up into separate chunks
 */
const chunkify = <T=any>(arr:T[], size=1) => {
  const chunks:Record<string|number, T[]> = {}
  let ref = 0
  if(size < 1) size = 1

  for (let i = 0; i < arr.length; i += size){
    chunks[ref] = arr.slice(i, i + size)
    ref++
  }

  return chunks
}

/**
 * Splits the jobs up into chucks to be passed to each worker
 * Any jobs that don't fit into the workers are pushed into their own stack
 * When a workers finishes all their original jobs
 * They will pull extra jobs off the stack
 */
export const splitWork = (exam:TExamConfig & { file?:string }, locations:string[]) => {
  const total = locations.length

  const {
    workers,
    concurrency,
  } = getWAndC(exam, locations.length)

  const chunks = exam.runInBand
    ? {[0]: locations}
    : chunkify<string>([...locations], concurrency)
    
  return {
    total,
    chunks,
    workers,
    concurrency,
  }
}