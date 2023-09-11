import type { TLocEvtData } from "@gobletqa/exam"
import type { TReporterOpts } from "../HtmlReporter"

import { Script } from './Script'
import { TestsHtml } from "./TestsHtml"
import { TitleHtml } from "./TitleHtml"
import { OverviewHtml } from './OverviewHtml'

type TBodyHtml = TReporterOpts & {
  title?:string
  date?:string
  data:TLocEvtData
  totalTime?:string|number
}

export const BodyHtml = (args:TBodyHtml) => {
  const {
    data,
    date,
    title,
    totalTime,
    ...opts
  } = args

  return `
    <body>
      ${TitleHtml(title, date, totalTime)}
      ${OverviewHtml(data)}
      ${TestsHtml(data, opts)}
      ${Script()}
    </body>
  `
}