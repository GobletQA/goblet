import type { TLocEvtData } from "@gobletqa/exam"
import { Script } from './Script'
import { TestsHtml } from "./TestsHtml"
import { TitleHtml } from "./TitleHtml"
import { OverviewHtml } from './OverviewHtml'

export const BodyHtml = (
  data:TLocEvtData,
  currentDate:string,
  reportTitle:string,
) => {
  
  return `
    <body>
      ${TitleHtml(reportTitle, currentDate)}
      ${OverviewHtml(data)}
      ${TestsHtml(data)}
      ${Script()}
    </body>
  `
}