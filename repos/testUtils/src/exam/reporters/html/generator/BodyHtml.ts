import type { TExEventData } from "@gobletqa/exam"
import type { TReporterOpts } from "../HtmlReporter"
import type { TBuiltStats } from '../utils/getStats'

import { Script } from './Script'
import { TestsHtml } from "./TestsHtml"
import { TitleHtml } from "./TitleHtml"
import { IconsHtml } from './IconsHtml'
import { OverviewHtml } from './OverviewHtml'

type TBodyHtml = TReporterOpts & {
  title?:string
  date?:string
  location:string
  data:TExEventData
  stats:TBuiltStats
  combineTests?:boolean
  totalTime?:string|number
}

export const BodyHtml = (args:TBodyHtml) => {
  const {
    data,
    date,
    title,
    stats,
    totalTime,
    combineTests,
    ...opts
  } = args

  return combineTests
    ? `
        <section class="test-section ${data.status ?? ``}" >
          <div class="test-location-container ${data.status ?? ``}" onclick="toggleSection('${data.timestamp}')" >
            <span class="location-icon-container">
              ${IconsHtml(data.status)}
            </span>
            <span class="test-location-text">
              ${opts?.location || data?.location}
            </span>
          </div>
          ${TestsHtml(data, opts)}
        </section>
      `
    : `
        <body>
          ${TitleHtml(title, date, totalTime)}
          ${OverviewHtml(stats)}
          ${TestsHtml(data, opts)}
          ${Script()}
        </body>
      `
}