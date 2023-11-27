import type { TBuiltStats } from '../utils/getStats'
import type { THtmlPartials } from "../HtmlReporter"

import { Script } from './Script'
import { TitleHtml } from "./TitleHtml"
import { joinStats } from '../utils/getStats'
import { OverviewHtml } from './OverviewHtml'

type TPartialsHtml = {
  title?:string
  date?:string
  partials?:THtmlPartials
  totalTime?:string|number
}

export const PartialsHtml = (args:TPartialsHtml) => {
  const {
    date,
    title,
    partials,
    totalTime,
  } = args

  let joinedStats:TBuiltStats

  const htmlArr = Object.entries(partials).map(([loc, { html, stats}]) => {
    joinedStats = joinStats(stats, joinedStats)
    return html
  })

  return `
    <body>
      ${TitleHtml(title, date, totalTime)}
      ${OverviewHtml(joinedStats)}
      ${htmlArr.join(`\n`)}
      ${Script()}
    </body>
  `
}