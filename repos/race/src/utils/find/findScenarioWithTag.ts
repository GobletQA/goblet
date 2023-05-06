import type { TRaceScenario } from '@GBR/types'

const cleanTag = (tag:string=``) => tag.replace(/$@/, ``).toLowerCase()

export const findScenarioWithTag = (scenarios:TRaceScenario[], tag:string) => {
  return scenarios.find(scn => {
    return scn?.tags?.tokens?.length
      && scn?.tags?.tokens?.find(stag => stag === tag || cleanTag(stag) === cleanTag(tag))
  })
}