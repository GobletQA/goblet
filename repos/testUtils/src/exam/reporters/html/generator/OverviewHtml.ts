import type { TBuiltStats } from '../utils/getStats'
import {
  colors,
  margin,
  padding,
} from './theme'

const overviewStyle = () => {
  return `
    <style>
      .overview-container  {
        margin-bottom: ${margin.dpx};
      }
    
      .overview-card {
        padding: ${padding.hpx};
        background-color: ${colors.w00};
      }
      
      .overview-card h4 {
        margin: 0px;
        font-size: 14px;
        margin-bottom: ${margin.hpx};
      }

      .overview-container .overview-sections {
        display: flex;
      }
      .overview-container .overview-section {
        flex-basis: 15%;
        min-width: 125px;
        margin-right: ${margin.px};
      }
      
      .overview-container .overview-section .overview-text {
        font-size: 12px;
        padding: ${padding.qpx};
        padding-left: ${padding.hpx};
        margin-left: ${margin.hpx};
        margin-bottom: ${margin.qpx};
      }
      
      .overview-container .overview-text.overview-passed {
        color: ${colors.pass};
        border-left: 5px solid ${colors.pass};
      }

      .overview-container .overview-text.overview-failed {
        color: ${colors.fail};
        font-weight: bold;
        border-left: 5px solid ${colors.fail};
      }

      .overview-container .overview-text.overview-skipped {
        color: ${colors.skip};
        border-left: 5px solid ${colors.skip};
      }

    </style>
  `
}

export const OverviewHtml = (stats:TBuiltStats) => {
  const {
    failed,
    passed,
    skipped,
  } = stats

  return `
    ${overviewStyle()}
    <div class="overview-container">
      <div class="overview-sections" >

        <div class="overview-section scenarios overview-card" >
          <h4 class="overview-section-header" >Features</h4>
          <div class="overview-text overview-failed" >
            ${failed.features} failed
          </div>
          <div class="overview-text overview-passed" >
            ${passed.features} passed
          </div>
          <div class="overview-text overview-skipped" >
            ${skipped.features} skipped
          </div>
        </div>

        <div class="overview-section scenarios overview-card" >
          <h4 class="overview-section-header" >Parents</h4>
          <div class="overview-text overview-failed" >
            ${failed.parents} failed
          </div>
          <div class="overview-text overview-passed" >
            ${passed.parents} passed
          </div>
          <div class="overview-text overview-skipped" >
            ${skipped.parents} skipped
          </div>
        </div>

        <div class="overview-section overview-steps overview-card" >
          <h4 class="overview-section-header" >Steps</h4>
          <div class="overview-text overview-failed">
            ${failed.steps} failed
          </div>
          <div class="overview-text overview-passed">
            ${passed.steps} passed
          </div>
          <div class="overview-text overview-skipped">
            ${skipped.steps} skipped
          </div>
        </div>

      </div>
    </div>
  `
}