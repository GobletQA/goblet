import type { TExamConfig } from '@GEX/types'

import os from 'os'
import { toNum, exists } from '@keg-hub/jsutils'
import { printTooManyWorkers } from '@GEX/debug/verbose'

const cpuCount = os.cpus().length

export const getWorkerNum = (workers?:number, locationsAmt:number=1) => {
  const oneLessCpus = process.env.EXAM_WORKER_AMOUNT
    ? toNum(process.env.EXAM_WORKER_AMOUNT)
    : cpuCount - 1

  let amount = workers > 0 ? workers : oneLessCpus > 0 ? oneLessCpus : 1
  
  if(amount > cpuCount){
    printTooManyWorkers(amount, oneLessCpus)
    amount = amount > cpuCount ? oneLessCpus : amount
  }

  // One create as many workers as we have files to be tested
  return amount > locationsAmt ? locationsAmt : amount
}

export const getConcurrency = (concurrency?:number, evenSplit?:number) => {
  return concurrency > 0 ? concurrency : evenSplit > 0 ? evenSplit : 1
}

export const getWAndC = (exam:TExamConfig, locationsAmt:number) => {
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
export const chunkify = <T=any>(arr:T[], size=1, workers?:number) => {

  // If only 1 worker, ensure all files goes to that worker
  if(exists(workers) && workers <= 1)
    size = arr.length
  
  const chunks:Record<string|number, T[]> = {}
  let ref = 0
  if(size < 1) size = 1

  for (let i = 0; i < arr.length; i += size){
    chunks[ref] = arr.slice(i, i + size)
    ref++
  }

  return chunks
}



export const splitWork = (exam:TExamConfig & { file?:string }, locations:string[]) => {
  const total = locations.length

  const {
    workers,
    concurrency,
  } = getWAndC(exam, locations.length)

  const chunks = exam.runInBand
    ? {[0]: locations}
    : chunkify<string>([...locations], concurrency, workers)
    
  return {
    total,
    chunks,
    workers,
    concurrency,
  }
}