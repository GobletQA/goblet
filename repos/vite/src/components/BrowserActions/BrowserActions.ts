import type { TActionGroupActions, TBrowserAction } from '@gobletqa/components'
import { PlayAction } from './PlayAction'
import { StateAction } from './StateAction'
// import { RecordAction } from './RecordAction'
import { EmptyAction } from './EmptyAction'

const leftActions = [
  PlayAction,
  // RecordAction,
] as TActionGroupActions

leftActions.name = `browser-left-actions-group`

const centerActions = [
  EmptyAction,
] as TActionGroupActions

centerActions.name = `browser-center-actions-group`

export const BrowserActions:(TBrowserAction|TActionGroupActions)[] = [
  leftActions,
  centerActions,
  StateAction,
]
