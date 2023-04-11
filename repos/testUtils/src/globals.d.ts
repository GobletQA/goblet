import type { TJasmine } from '@ltipton/parkin'
import type { TGobletTestGlobal } from './types'

declare global {
  type jasmine = TJasmine
  type __goblet = TGobletTestGlobal
}
