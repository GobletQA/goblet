import type { TAddActiveTestRunEvts } from '@types'


export const getEvents = (opts:TAddActiveTestRunEvts) => {
  const { events=[], event } = opts
  const evts = !event || events.find(evt => evt?.timestamp ===  event?.timestamp)
    ? events
    : [...events, event]

  const failedEvt = evts.find(evt => evt.status === `failed`)

  return { events: evts, failedLoc: failedEvt?.location }
}
