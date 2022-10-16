const { environment:develop } = require('./develop.js')
const { environment:qa } = require('./qa.js')

module.exports = {
  qa,
  develop,
}