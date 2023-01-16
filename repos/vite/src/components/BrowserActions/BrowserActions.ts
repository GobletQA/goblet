import type { TActionGroupActions, TBrowserAction } from '@gobletqa/components'
import { PlayAction } from './PlayAction'
import { StateAction } from './StateAction'
import { EmptyAction } from './EmptyAction'
import { RecordAction } from './RecordAction'

const centerActions = [
  PlayAction,
  RecordAction,
] as TActionGroupActions

centerActions.name = `browser-center-actions-group`

const rightActions = [
  EmptyAction,
] as TActionGroupActions

rightActions.name = `browser-right-actions-group`

export const BrowserActions:(TBrowserAction|TActionGroupActions)[] = [
  StateAction,
  centerActions,
  rightActions
]
