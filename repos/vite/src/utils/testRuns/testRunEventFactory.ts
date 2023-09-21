import type { TTestRunEvent, TPlayerResEvent, TPlayerEventData } from '@types'

const getUuid = (evt:TPlayerResEvent) => {
  const loc = evt?.data?.location || evt?.location

  let name:string|undefined = ``
  if(loc) name = loc.split?.(`/`)?.pop()?.split?.(`.`)?.shift?.() || ``

  const idRef = evt?.data?.id || evt?.data?.testPath || ``
  const type = evt?.data?.type

  return [name, type, idRef].filter(Boolean).join(`-`)

}

const getText = (evt:TPlayerResEvent) => {
  if(!evt?.data?.metaData) return evt?.data?.description || evt?.message || ``

  const {
    metaData,
    eventParent
  } = evt.data

  const {
    step,
    rule,
    feature,
    scenario,
    background,
  } = metaData

  const text = evt?.data?.metaData[eventParent as keyof typeof evt.data.metaData]

  return text
    || step
    || rule
    || feature
    || scenario
    || background

}

export const testRunEventFactory = (evt:TPlayerResEvent, trEvt?:TTestRunEvent) => {
  const {
    id,
    runId,
    message,
    data={} as TPlayerEventData,
  } = evt

  const {
    type,
    stats,
    status,
    action,
    failed,
    passed,
    skipped,
    timestamp,
    location,
    metaData={},
    description,
  } = data

  return {
    id,
    type,
    stats,
    runId,
    action,
    failed,
    passed,
    skipped,
    text: getText(evt),
    location: location || evt.location,
    description: description || message,
    timestamp: timestamp || evt.timestamp,
    uuid: metaData?.uuid || getUuid(evt),
    status: status || failed && `failed` || passed && `passed` || `unknown`,
    ...trEvt,
  } as TTestRunEvent
}