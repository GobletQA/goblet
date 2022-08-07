module.exports = {
  docker: {
    name: 'docker',
    alias: ['doc', 'dc'],
    tasks: {
      ...require('./build'),
      ...require('./login'),
      ...require('./pull'),
      ...require('./run'),
    },
  },
}
