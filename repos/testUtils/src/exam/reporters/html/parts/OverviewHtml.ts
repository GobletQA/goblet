import type { TLocEvtData } from "@gobletqa/exam"
import {
  colors,
  margin,
  padding,
} from './theme'

type TOverviewType = `passed`|`failed`|`skipped`
type TOverviewStats = {
  steps:number
  scenarios:number
}

const countFailedScenarios = (describes: any[]):number => {
  return describes.filter(scenario => scenario.failed).length
}

const countFailedTests = (describes: any[]): number => {
  return describes.reduce((scenarioTotal, scenario) => {
    return scenarioTotal + (scenario?.tests?.filter?.(test => test.failed).length || 0)
  }, 0)
}

const countFailed = (data:TLocEvtData) => {
  return {
    failed: {
      steps: countFailedTests(data.describes),
      scenarios: countFailedScenarios(data.describes),
    },
    passed: {
      steps: 0,
      scenarios: 0,
    },
    skipped: {
      steps: 0,
      scenarios: 0,
    }
  }
}

export const OverviewHtml = (data:TLocEvtData) => {
  const {
    failed,
    passed,
    skipped,
  } = countFailed(data)

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
    <div class="overview-container">
      <div class="overview-sections" >
        <div class="overview-section scenarios overview-card" >
          <h4 class="overview-section-header" >Scenarios</h4>
          <div class="overview-text overview-failed" >
            ${failed.scenarios} failed
          </div>
          <div class="overview-text overview-passed" >
            ${passed.scenarios} passed
          </div>
          <div class="overview-text overview-skipped" >
            ${skipped.scenarios} skipped
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