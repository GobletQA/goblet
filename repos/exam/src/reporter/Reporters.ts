import { DefaultReporters } from '@GEX/constants'
import { BaseReporter } from './BaseReporter'
import { SilentReporter } from './SilentReporter'


export const Reporters = {
  [DefaultReporters.default]: BaseReporter,
  [DefaultReporters.silent]: SilentReporter,
}
