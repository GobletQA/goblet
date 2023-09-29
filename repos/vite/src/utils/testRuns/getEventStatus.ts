import {TTestRunEventStages} from "@types"


export const getEventStatus = (stages:TTestRunEventStages, canceled?:boolean) => {
  const { start, end } = stages
  const evtStatus = start && !end
    ? `running`
    : end?.status || (start?.status !== `unknown` ? start?.status || `unknown` : `loading`)

  return canceled && evtStatus !== `passed` && evtStatus !== `failed`
    ? `canceled`
    : evtStatus
}
