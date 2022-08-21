import { user } from './user'
import { repo } from './repo'
import { repos } from './repos'
import { routes } from './routes'
import { screens } from './screens'
import { screencast } from './screencast'
import { specResults } from './specResults'

export const itemsState = {
  ...user,
  ...repo,
  ...repos,
  ...routes,
  ...screens,
  ...screencast,
  ...specResults,
}
