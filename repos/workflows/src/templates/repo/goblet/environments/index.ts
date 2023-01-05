import { environment as qa } from './qa.js'
import { environment as develop } from './develop.js'
const environment = ({
  qa,
  develop,
})[process.env.GOBLET_ENV || process.env.NODE_ENV || `develop`]

export {
  environment as default
}