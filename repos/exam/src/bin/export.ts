import "./init"
import "@GEX/utils/logger"
import type { TExamCliOpts } from "@GEX/types"

import { removeEmpty } from './helpers'
import { getConfig } from './getConfig'
import { initLocal } from './initLocal'
import { updateCLIEnvs } from './helpers'
import { initWorkers } from './initWorkers'
import { printDebugResults } from '@GEX/debug'

export const exam = async (opts:TExamCliOpts) => {
  const config = await getConfig(opts)
  const exam = removeEmpty(config)

  updateCLIEnvs(exam, opts)

  const [result, time] = exam?.runInBand
    ? await initLocal(exam, opts)
    : await initWorkers(exam, opts)

  printDebugResults(result, time)

}
