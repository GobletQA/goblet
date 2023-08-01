import { TPipelineArgs, TStateManager } from '@GEX/types'

import { Logger } from '@GEX/utils/logger'
import { loadReporterTask } from '../tasks/loadReporterTask'
import { ReportEventMapper } from '@GEX/reporter/ReportEventMapper'


export const reportersStep = async (args:TPipelineArgs, manager?:TStateManager) => {
  Logger.debug(`------- reportersStep -------`)

  const EventReporter = new ReportEventMapper()
  const reporters = await loadReporterTask(args)
  EventReporter.reporters = reporters

  manager.setValue(`EventReporter`, EventReporter)

  args.rewind.push(async () => EventReporter.cleanup())

}