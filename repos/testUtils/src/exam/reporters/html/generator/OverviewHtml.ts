import type { TBuiltStats } from '../utils/getStats'


export const OverviewHtml = (stats:TBuiltStats) => {
  const {
    failed,
    passed,
    skipped,
  } = stats

  return `
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