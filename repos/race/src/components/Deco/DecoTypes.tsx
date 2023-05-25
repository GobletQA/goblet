import { ERaceDecoType } from '@GBR/types'
import { DecoPass } from './DecoPass'
import { DecoFail } from './DecoFail'
import { DecoSpin } from './DecoSpin'
import { DecoError } from './DecoError'
import { DecoSuccess } from './DecoSuccess'


export const DecoTypes = {
  [ERaceDecoType.pass]: DecoPass,
  [ERaceDecoType.fail]: DecoFail,
  [ERaceDecoType.spin]: DecoSpin,
  [ERaceDecoType.error]: DecoError,
  [ERaceDecoType.success]: DecoSuccess,
}