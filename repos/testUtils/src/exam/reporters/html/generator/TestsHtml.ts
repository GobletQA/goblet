import type { TReporterOpts } from '../HtmlReporter'
import type { TLocEvtData, TRunResult } from "@gobletqa/exam"

import { IconsHtml } from './IconsHtml'
import { capitalize } from '@keg-hub/jsutils/capitalize'
import {
  colors,
  margin,
  padding,
} from './theme'

const stepKeys = [
  `step`,
  `given`,
  `when`,
  `then`,
  `and`,
  `but`,
  `*`
]


const keywords = [
  `feature`,
  `rule`,
  `background`,
  `scenario`,
  ...stepKeys
]


const sortByTimestamp = (tests: TRunResult[]): TRunResult[] => {
  return tests?.sort((a: any, b: any) => a.timestamp - b.timestamp) || []
}

const status = (item:TRunResult) => {
  return item.status
    ? item.status
    : item.passed ? `passed` : `failed`
}

const TitleHtml = (text:string, type:string=``, state:string=``) => {
  if(!text.includes(` `)) return ``

  const [key, ...rest] = text.includes(`>`)
    ? text.split(`>`)
    : text.split(` `)

  const cleaned = key.trim().toLowerCase()

  let keyword = keywords.includes(cleaned) ? cleaned : ``

  if(!keyword){
    keyword = type
    rest.unshift(key)
    return rest.join(` `)
  }

  const className = stepKeys.includes(keyword)
    ? `step`
    : keyword

  const KeywordHtml = keyword
    ? `<span class="title-text title-keyword ${className}-keyword ${state}">${capitalize(keyword)}</span>`
    : ``

  return `
    <div class="${className}-title item-title ${state}" >
      ${KeywordHtml}
      <span class="title-text title-description ${state}">
        ${rest.join(` `)}
      </span>
    </div>
  `
}

const FailedList = (test: TRunResult, opts:TReporterOpts) => {
  return test.failedExpectations.map((expectation: any) => {
    return `
      <li class="list-item failed-item step-failed failed">
        <div class="failed-description" >
          <pre>
            ${expectation.description}
          </pre>
          ${opts?.onRenderError?.(test) || ``}
        </div>
      </li>
    `
  }).join('')
}

const StepList = (tests: TRunResult[], opts:TReporterOpts) => {
  return sortByTimestamp(tests)
    .map((test, idx) => {
      const state = status(test)
      let testTime = opts?.testTimes?.[test?.id]?.length
      if(!testTime) testTime = state === `skipped` ? state : `unknown`
      else testTime = `${testTime}s`
      
        
      
      const toggleError = test.failedExpectations.length > 0 ? `onclick="toggleError(${idx})"` : ``

      const FailedHtml = test?.failedExpectations?.length
        ? `<ul class="list-parent failed-list" id="error-${idx}" style="visibility:hidden;max-height:0px;">${FailedList(test, opts)}</ul>`
        : ``

      return `
        <li class="list-item step-item step-${state} ${state}">
          <div class="step-description ${state}" ${toggleError}>
            <span class="step-icon-container">
              ${IconsHtml(state as any)}
            </span>
            ${TitleHtml(test.description, `step`, state)}
            <div class="step-time">${testTime}</div>
          </div>
          ${opts?.onRenderTest?.(test) || ``}
          ${FailedHtml}
        </li>
      `
    }).join('')
}

const ScenarioList = (scenarios: TRunResult[], opts:TReporterOpts) => {
  return scenarios?.map((scenario) => {
    const state = status(scenario)
    return `
      <li class="list-item scenario-item scenario-${state} ${state}">
        ${TitleHtml(scenario.description || ``, `scenario`)}
        <ul class="scenario-list list-parent" >
          ${StepList(scenario?.tests || [], opts)}
        </ul>
      </li>
    `
  }).join('')
}


const FeatureList = (features: TRunResult[], opts:TReporterOpts) => {
  return features.map((feature) => {
    const state = status(feature)
    return `
      <li class="list-item feature-item feature-${state} ${state}">
        ${TitleHtml(feature?.description || ``, `Feature`)}
        <ul class="feature-list list-parent" >
          ${ScenarioList(feature?.describes || [], opts)}
        </ul>
      </li>
    `
  }).join('')
}

const testStyles = () => {
  return `
    <style>

      .list-parent {
        padding-left: ${padding.px};
      }

      .root-list.list-parent {
        padding-left: 0px;
      }

      .root-list .list-item .item-title {
        padding: ${padding.qpx} 0px;
      }
      
      .root-list .list-item.step-skipped {
        opacity: 0.5;
      }

      .root-list svg.step-icon {
        height: 20px;
        width: 20px;
      }
      
      .root-list .title-keyword {
        padding-right: ${padding.qpx};
        font-weight: bold;
      }
      .root-list .feature-keyword {
        color: ${colors.primary};
      }
      .root-list .scenario-keyword {
        color: ${colors.secondary};
      }


      .root-list .step-keyword.failed {
        color: ${colors.fail};
      }
      
      .root-list .step-title .title-text.failed {
        color: ${colors.fail};
      }

      .root-list .title-description {
        color: ${colors.c16};
      }
      
      .root-list .feature-list {
        padding-left: ${padding.px};
      }
      
      .root-list .scenario-list {
        padding-left: 0px;
      }

      .root-list .failed-list {
        overflow: hidden;
        padding-left: 0px;
        transition: max-height 1s ease;
      }

      .root-list .failed-list .failed-description {
        margin-top: 0px;
        color: ${colors.c21};
        padding: ${padding.dpx};
        margin-bottom: ${margin.qpx};
        background-color: ${colors.w01};
        display: flex;
        flex-direction: column;
      }
      
      .root-list .failed-list .failed-description pre {
        margin-top: 0px;
      }

      .root-list .failed-list .test-image-container {
        width: 100%;
        text-align: center;
      }
      .root-list .failed-list .test-image {
        width: 60%;
        border: ${margin.hpx} solid ${colors.w};
      }

      .root-list .step-item {
        width: 100%;
        margin-bottom: ${margin.qpx};
      }

      .root-list .step-item .step-description {
        display: flex;
        align-items: center;
        padding: ${padding.hpx} ${padding.px} 7px;
        justify-content: space-between;
      }

      .root-list .step-item .step-description.failed {
        cursor: pointer;
        background-color: ${colors.failBg};
      }

      
      .root-list .step-item .step-description .step-icon-container {
        margin-right: ${margin.hpx};
        height: 23px;
      }
      
      .root-list .step-item .step-description .step-time {
        margin-left: auto;
      }

    </style>
  `
}

export const TestsHtml = (data:TLocEvtData, opts:TReporterOpts) => {
  const state = status(data as TRunResult)
  return `
    ${testStyles()}
    <ul class="root-list list-parent root-${state} ${state}">
      ${FeatureList(data.describes, opts)}
    </ul>
  `
}