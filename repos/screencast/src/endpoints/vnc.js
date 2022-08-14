const { asyncWrap, apiRes } = require('@gobletqa/shared/express')
const { AppRouter } = require('@gobletqa/shared/express/appRouter')
const {
  stopVNC,
  startVNC,
  statusVNC,
  stopSockify,
  startSockify,
  statusSockify,
} = require('@GSC/Libs/vnc')

const vncStatus = asyncWrap(async (req, res) => {
  const status = await statusVNC()
  return apiRes(res, { status }, 200)
})

const vncStart = asyncWrap(async (req, res) => {
  const status = await startVNC()
  return apiRes(res, { status }, 200)
})

const vncStop = asyncWrap(async (req, res) => {
  const status = await stopVNC()
  return apiRes(res, { status }, 200)
})

const vncRestart = asyncWrap(async (req, res) => {
  await stopVNC()
  const status = await startVNC()
  return apiRes(res, { status }, 200)
})

module.exports = (...args) => {
  AppRouter.get('/screencast/vnc/status', vncStatus)
  AppRouter.post('/screencast/vnc/start', vncStart)
  AppRouter.post('/screencast/vnc/stop', vncStop)
  AppRouter.post('/screencast/vnc/restart', vncRestart)
}
