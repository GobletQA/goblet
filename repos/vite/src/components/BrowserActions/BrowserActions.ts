import type { TActionGroupActions, TBrowserAction } from '@gobletqa/components'
import { PlayAction } from './PlayAction'
import { StateAction } from './StateAction'
import { RecordAction } from './RecordAction'
import { SpinnerAction } from './SpinnerAction'

const centerActions = [
  PlayAction,
  RecordAction,
] as TActionGroupActions

centerActions.name = `browser-center-actions-group`

const rightActions = [
  SpinnerAction,
] as TActionGroupActions

rightActions.name = `browser-right-actions-group`

export const BrowserActions:(TBrowserAction|TActionGroupActions)[] = [
  StateAction,
  centerActions,
  rightActions
]
