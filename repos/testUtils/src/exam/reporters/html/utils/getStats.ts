import type { TExEventData } from "@gobletqa/exam"

export type TStatsObj = {
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

export type TStatCountObj = {
  steps: number
  parents: number
  features: number
}

export type TBuiltStats = {
  failed:TStatCountObj
  passed:TStatCountObj
  skipped:TStatCountObj
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

const countStats = (features: any[]) => {
  const stats:TStatsObj = {
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


export const getStats = (data:TExEventData) => {
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
  } as TBuiltStats
}

const joinCounts = (count:TStatCountObj, joinedCount:TStatCountObj) => {
  return {
    steps: count.steps + joinedCount.steps,
    parents: count.parents + joinedCount.parents,
    features: count.features + joinedCount.features,
  }
}

export const joinStats = (stats:TBuiltStats, joinedStats:TBuiltStats) => {
  return !joinedStats
    ? stats
    : {
        failed: joinCounts(stats.failed, joinedStats.failed),
        passed: joinCounts(stats.passed, joinedStats.passed),
        skipped: joinCounts(stats.skipped, joinedStats.skipped),
      }
}

