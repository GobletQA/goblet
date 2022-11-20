
/**
 * Overrides the default jsutils Throttle type. Is currently incorrect
 */
export type TThrottle = <T=(...args:any[])=> any>(
  func: (...params: any[]) => any,
  cb?: any,
  wait?: number,
) => T