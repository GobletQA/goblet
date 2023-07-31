import {TPipelineArgs} from "@GEX/types";
import { loadFilesTask }  from './loadFilesTask'
import { BaseReporter } from '@GEX/reporter/BaseReporter'
import {isArr, isStr} from "@keg-hub/jsutils"
import {IConstructable, IExamReporter} from "@GEX/types";


export const loadReporterTask = async (args:TPipelineArgs) => {
  const { config } = args

  const reporters:IExamReporter[] = [new BaseReporter(config, {})]

  if(isArr(config.reporters)){

    const formattedReports = (config.reporters as any[]).reduce((acc, report) => {
      if(isStr(report)) acc[report] = [report, {}]
      else acc[report[0]] = report

      return acc
    }, {})

    const loaded = await loadFilesTask(args, formattedReports)

    Object.entries(loaded)
      .forEach(([loc, Report]:[string, IConstructable<IExamReporter>]) => {
        const opts = formattedReports[loc] ? formattedReports[loc][1] : {}
        reporters.push(new Report(config, opts))
      })

  }

  return reporters

}