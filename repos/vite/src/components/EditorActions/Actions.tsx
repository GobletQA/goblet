import { TextAction } from './TextAction'
import { DrawAction } from './DrawAction'
import { ArrowAction } from './ArrowAction'
import { ClearAction } from './ClearAction'
import { SquareAction } from './SquareAction'
import { PictureAction } from './PictureAction'
import { DecorationAction } from './DecorationAction'
import { WorldEditorAction } from './WorldEditorAction'

export const RaceActions = [
  DecorationAction,
  WorldEditorAction,
  DrawAction,
  SquareAction,
  PictureAction,
]

export const MonacoActions = [
  DecorationAction,
  DrawAction,
  TextAction,
  ArrowAction,
  SquareAction,
  ClearAction,
  PictureAction,
]
