import type { TBuiltStats } from '../utils/getStats'
import type { THtmlPartials } from "../HtmlReporter"

import { Script } from './Script'
import { TitleHtml } from "./TitleHtml"
import { joinStats } from '../utils/getStats'
import { OverviewHtml } from './OverviewHtml'
import {
  font,
  colors,
  margin,
  padding,
} from './theme'

type TPartialsHtml = {
  title?:string
  date?:string
  partials?:THtmlPartials
  totalTime?:string|number
}

const testStyles = () => {
  return `
    <style>
      section.test-section {
        margin-top: ${margin.dpx};
      }

      section.test-section .test-location-container {
        font-size: 18px;
        cursor: pointer;
        margin-bottom: ${margin.px};
        padding: ${padding.hpx} ${padding.px};
      }
      
      section.test-section .test-location-container.failed {
        opacity: 0.7;
        ${colors.background.failed}
      }

      section.test-section .test-location-container.passed {
        opacity: 0.7;
        ${colors.background.passed}
      }

      section.test-section .test-location-container.skipped {
        opacity: 0.7;
        ${colors.background.skipped}
      }
      
      section.test-section .root-list {
        overflow: hidden;
        padding-left: ${padding.px};
        transition: max-height 500ms ease;
      }
      
    </style>
  `
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
      ${testStyles()}
      ${TitleHtml(title, date, totalTime)}
      ${OverviewHtml(joinedStats)}
      ${htmlArr.join(`\n`)}
      ${Script()}
    </body>
  `
}