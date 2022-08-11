module.exports = {
  docker: {
    name: `docker`,
    alias: [ `dock`, `doc`, `dc`],
    tasks: {
      ...require('./build'),
      ...require('./login'),
      ...require('./pull'),
      ...require('./run'),
    },
  },
}
