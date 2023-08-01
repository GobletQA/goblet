import type { TPipelineArgs, IConstructable, IExamReporter } from "@GEX/types"

import {isArr, isStr} from "@keg-hub/jsutils"
import { loadFilesTask }  from './loadFilesTask'
import { BaseReporter } from '@GEX/reporter/BaseReporter'
import {DefaultReporters} from "@GEX/constants"


type TReports = string|[string, IConstructable<IExamReporter>]

export const loadReporterTask = async (args:TPipelineArgs) => {
  const { config } = args

  const reporters:IExamReporter[] = []

  if(isArr(config.reporters)){

    const formattedReports = (config.reporters as TReports[])
      .reduce((acc, report) => {

        if(isStr(report)){
          if(report === DefaultReporters.default){
            reporters.push(new BaseReporter(config, {}))
            return acc
          }

          acc[report] = [report, {}]
        }
        else acc[report[0]] = report

        return acc
      }, {})

    const loaded = await loadFilesTask<Record<string, IConstructable<IExamReporter>>>(
      args,
      formattedReports
    )

    Object.entries(loaded)
      .forEach(([loc, Report]:[string, IConstructable<IExamReporter>]) => {
        const opts = formattedReports[loc] ? formattedReports[loc][1] : {}

        reporters.push(new Report(config, opts))
      })

  }
  else {
    reporters.push(new BaseReporter(config, {}))
  }

  return reporters

}