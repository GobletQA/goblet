import type { TExEventData } from "@gobletqa/exam"
import {
  colors,
  margin,
  padding,
} from './theme'

type TStatsObj = {
  failedFeatures?:number
  passedFeatures?:number
  skippedFeatures?:number
  failedParents?:number
  passedParents?:number
  failedSteps?:number
  passedSteps?:number
  skippedSteps?:number
  skippedParents?:number
}

const loopParent = (parent:TExEventData, stats:TStatsObj) => {
  parent?.tests?.length
    && parent?.tests?.forEach((test:TExEventData) => {
        if(test.status === `skipped`) stats.skippedSteps += 1
        else if(test.passed) stats.passedSteps += 1
        else stats.failedSteps += 1
      })

  parent?.describes?.length
    && parent.describes.forEach((describe:TExEventData) => {
      if(describe.status === `skipped`) stats.skippedParents += 1
      else if(describe.passed) stats.passedParents += 1
      else stats.failedParents += 1

      loopParent(describe, stats)
    })

  return stats
}

const countStats = (features: any[]): any => {
  const stats = {
    failedFeatures: 0,
    passedFeatures: 0,
    skippedFeatures: 0,
    failedParents: 0,
    passedParents: 0,
    skippedParents: 0,
    failedSteps: 0,
    passedSteps: 0,
    skippedSteps: 0,
  }

  features.forEach((feature) => {
    if(feature.status === `skipped`) stats.skippedFeatures += 1
    else if(feature.passed) stats.passedFeatures += 1
    else stats.failedFeatures += 1

    loopParent(feature, stats)
  })

  return stats
}


const getStats = (data:TExEventData) => {
  const stats = countStats(data.describes)
  return {
    failed: {
      steps: stats.failedSteps,
      parents: stats.failedParents,
      features: stats.failedFeatures,
    },
    passed: {
      steps: stats.passedSteps,
      parents: stats.passedParents,
      features: stats.passedFeatures,
    },
    skipped: {
      steps: stats.skippedSteps,
      parents: stats.skippedParents,
      features: stats.skippedFeatures,
    }
  }
}

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

export const OverviewHtml = (data:TExEventData) => {
  const {
    failed,
    passed,
    skipped,
  } = getStats(data)

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