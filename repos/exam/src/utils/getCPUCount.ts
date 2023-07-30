import os from 'os'
import { toNum, exists } from '@keg-hub/jsutils'

let __CpuCount:number

export const getCPUCount = () => {
  if(__CpuCount) return __CpuCount

  const {
    EXAM_DEV_CLI,
    JEST_WORKER_ID,
    EXAM_CPU_AMOUNT,
  } = process.env
  
  if(exists(JEST_WORKER_ID) && exists(EXAM_DEV_CLI) && exists(EXAM_CPU_AMOUNT))
    return toNum(process.env.EXAM_CPU_AMOUNT)
  
  __CpuCount = os.cpus().length - 1

  return __CpuCount
}
