/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

let Interval:NodeJS.Timeout|undefined

export const clearRefreshTimer = () => {
  if(Interval) clearTimeout(Interval)
  Interval = undefined
}

export const refreshTimer = (
  cb:(params:any, refresh?:boolean) => any,
  params:any
) => {
  clearRefreshTimer()
  Interval = setInterval(async () => await cb?.(params), 60000 * 30)
}