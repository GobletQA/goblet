import type { TLocEvtData } from "@gobletqa/exam"

import {
  colors,
  margin,
  padding,
} from './theme'
import { GobletIcon } from './IconsHtml'

export const TitleHtml = (
  reportTitle:string,
  currentDate:string,
  totalTime?:string|number
) => {
  return `
    <div class="report-title">
      <style>
        .report-title {
          margin-bottom: ${margin.dpx};
        }
        
        .report-title .report-title-header {
          display: flex;
          margin-bottom: ${margin.px};
          border-bottom: 1px solid ${colors.c00};
          justify-content: flex-start;
          align-items: center;
        }

        .report-title .goblet-icon {
          max-width: 50px;
        }
        .report-title .goblet-icon svg {
          height: 50px;
          width: 50px;
        }

        .report-title .report-title-text {
          flex-grow: 2;
          padding-left: ${padding.px};
        }

        .report-title .report-sub-title{
          font-size: 20px;
          margin: 0px;
          padding: 0px;
          padding-top: ${padding.px};
        }

        .report-title .report-date {
          margin: 0px;
          padding: 0px;
          font-size: 14px;
          color: ${colors.c10};
        }
        .report-title .report-time {
          margin: 0px;
          padding: 0px;
          font-size: 14px;
          color: ${colors.c10};
          padding-top: ${padding.qpx};
        }
        

      </style>
      <div class="report-title-header" >
        <div class="goblet-icon">${GobletIcon}</div>
        <h1 class="report-title-text">${reportTitle}</h1>
      </div>
      <h3 class="report-sub-title">Test Results</h3>
      <p class="report-time" >Total Time: ${totalTime} seconds</p>
      <p class="report-date" >Generated: ${currentDate}</p>
    </div>
  `
}