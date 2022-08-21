import * as images from './images'
import * as build from './build'

export const docker = {
  name: `docker`,
  alias: [ `dock`, `doc`, `dc`],
  tasks: {
    ...require('./login'),
    ...require('./pull'),
    ...require('./run'),
    ...build,
    ...images,
  },
}
