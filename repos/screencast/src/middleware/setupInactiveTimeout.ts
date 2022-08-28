import type { Express, Request, Response, NextFunction } from 'express'

const createTimeout = (time:number) => {
  return setTimeout(() => {
    console.log(`Killing session container due to inactivity.`)
    process.exit(0)
  }, time)
}

/**
 * Helper to kill a running container
 * If no activity for the configured inactiveTimeout amount
 * Each request resets the timer
 */
export const setupInactiveTimeout = async (app:Express) => {
  const { inactiveTimeout, timeoutActive } = app?.locals?.config?.container
  
  if(!timeoutActive) return

  let timeoutId = createTimeout(inactiveTimeout)
  app.use((req:Request, res:Response, next:NextFunction) => {
    // Clear the last timeout, to the container does not exit
    clearTimeout(timeoutId)
    // Restart the timeout 
    timeoutId = createTimeout(inactiveTimeout)

    next()
  })

}
