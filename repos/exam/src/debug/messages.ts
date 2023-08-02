import { Logger } from '@GEX/utils/logger'
import { getCPUCount } from '@GEX/utils/getCPUCount'


export const printTooManyWorkers = (amount:number, oneLessCpus:number) => {
  Logger.debug([
    Logger.colors.yellow(`Attempting to use more workers (${amount}) then available ${getCPUCount()}`),
    `  - Defaulting to using default (${oneLessCpus}) instead`,
    `  - Please update your configuration`,
  ].join(`\n`))
}
