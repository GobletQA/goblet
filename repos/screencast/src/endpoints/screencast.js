const { parseJSON } = require('@keg-hub/jsutils')
const { asyncWrap, apiRes } = require('@gobletqa/shared/express')
const { AppRouter } = require('@gobletqa/shared/express/appRouter')
const {
  stopScreencast,
  startScreencast,
  statusScreencast,
} = require('@GSC/screencast')

/**
 * Endpoint to get the current status  of the browser
 */
const scStatus = asyncWrap(async (req, res) => {
  const { query } = req
  const status = await statusScreencast({
    ...query,
    ...(query.browser && { browser: parseJSON(query.browser) }),
  })
  status.lastCheck = new Date().getTime()

  return apiRes(res, status, 200)
})

/**
 * Endpoint to restart browser or start the browser if not running
 */
const scRestart = asyncWrap(async (req, res) => {
  const { params } = req

  await stopScreencast(params)
  const status = await startScreencast(params)

  return apiRes(res, status, 200)
})

/**
 * Endpoint to start browser if it's not running
 */
const scStart = asyncWrap(async (req, res) => {
  const { params } = req
  const status = await startScreencast(params)

  return apiRes(res, status, 200)
})

/**
 * Endpoint to stop browser if it's running
 */
const scStop = asyncWrap(async (req, res) => {
  const { params } = req
  const status = await stopScreencast(params)

  return apiRes(res, status, 200)
})

module.exports = (...args) => {
  AppRouter.get('/screencast/status', scStatus)
  AppRouter.post('/screencast/stop', scStop)
  AppRouter.post('/screencast/start', scStart)
  AppRouter.post('/screencast/restart', scRestart)
}
