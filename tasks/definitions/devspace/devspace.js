module.exports = {
  devspace: {
    name: 'devspace',
    alias: ['ds', 'dev'],
    tasks: {
      ...require('./attach'),
      ...require('./build'),
      ...require('./clean'),
      ...require('./cmd'),
      ...require('./deploy'),
      ...require('./log'),
      ...require('./run'),
      ...require('./start'),
      ...require('./status'),
      ...require('./sync'),
    },
  },
}
