import os from 'os'
import { toNum, exists } from '@keg-hub/jsutils'

let __CpuCount:number

export const getCPUCount = () => {
  if(__CpuCount) return __CpuCount

  const {
    EXAM_ENV,
    EXAM_DEV_CLI,
    EXAM_CPU_AMOUNT,
  } = process.env

  if(exists(EXAM_ENV) && exists(EXAM_DEV_CLI) && exists(EXAM_CPU_AMOUNT))
    return toNum(process.env.EXAM_CPU_AMOUNT)
  
  __CpuCount = os.cpus().length - 1

  return __CpuCount
}
