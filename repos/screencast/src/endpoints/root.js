const { asyncWrap, apiRes } = require('@gobletqa/shared/express')
const { AppRouter } = require('@gobletqa/shared/express/appRouter')

const apiRoot = asyncWrap(async (req, res) => {
  const config = req.app.locals.config

  return apiRes(
    res,
    {
      host: config.server.host,
      port: config.server.port,
    },
    200
  )
})

module.exports = () => {
  AppRouter.get('/', apiRoot)
}
