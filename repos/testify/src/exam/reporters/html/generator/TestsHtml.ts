import type { TExEventData } from "@gobletqa/exam"
import type { TReporterOpts } from '../HtmlReporter'

import { IconsHtml } from './IconsHtml'
import { stripAnsi } from '@GTU/Utils/stripAnsi'
import { capitalize } from '@keg-hub/jsutils/capitalize'


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


const sortByTimestamp = (tests: TExEventData[]): TExEventData[] => {
  return tests?.sort((a: any, b: any) => a.timestamp - b.timestamp) || []
}


const status = (item:TExEventData) => {
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

const FailedList = (test:TExEventData, opts:TReporterOpts) => {
  return test.failedExpectations.map((expectation: any) => {
    return `
      <li class="list-item failed-item step-failed failed">
        <div class="failed-description" >
          <div class="failed-description-header" >
            Step - failed
          </div>
          <div class="failed-description-text" >
            ${stripAnsi(expectation.description || ``)}
          </div>
          ${opts?.onRenderError?.(test, opts) || ``}
        </div>
      </li>
    `
  }).join('')
}

const StepList = (tests: TExEventData[], opts:TReporterOpts) => {
  return sortByTimestamp(tests)
    .map((test, idx) => {
      const state = status(test)
      let testTime = opts?.testTimes?.[test?.id]?.length
      if(!testTime) testTime = state === `skipped` ? state : `unknown`
      else testTime = `${testTime}s`
      
      const idRef = `${test?.id}-${idx}`
      
      const toggleError = test.failedExpectations.length > 0 ? `onclick="toggleError('${idRef}')"` : ``

      const FailedHtml = test?.failedExpectations?.length
        ? `<ul class="list-parent failed-list" id="error-${idRef}" style="visibility:hidden;max-height:0px;">${FailedList(test, opts)}</ul>`
        : ``

      return `
        <li class="list-item step-item step-${state} ${state}">
          <div class="step-description ${state}" ${toggleError}>
            <span class="step-icon-container">
              ${IconsHtml(state as any)}
            </span>
            ${TitleHtml(test?.description?.trim?.() || ``, `step`, state)}
            <div class="step-time">${testTime}</div>
          </div>
          ${opts?.onRenderTest?.(test, opts) || ``}
          ${FailedHtml}
        </li>
      `
    }).join('')
}

const ScenarioList = (scenarios: TExEventData[], opts:TReporterOpts) => {
  return scenarios?.map((scenario) => {
    const state = status(scenario)
    return `
      <li class="list-item scenario-item scenario-${state} ${state}">
        ${TitleHtml(scenario?.description?.trim?.() || ``, `scenario`)}
        <ul class="scenario-list list-parent" >
          ${StepList(scenario?.tests || [], opts)}
        </ul>
      </li>
    `
  }).join('')
}


const FeatureList = (features: TExEventData[], opts:TReporterOpts) => {
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


export const TestsHtml = (data:TExEventData, opts:TReporterOpts) => {
  const state = status(data)
  return `
    <ul class="root-list list-parent root-${state} ${state}" id="${data.timestamp}" >
      ${FeatureList(data.describes, opts)}
    </ul>
  `
}