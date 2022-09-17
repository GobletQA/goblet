import { Icon, TIconProps } from './Icon'
import GobletSvg from '@assets/goblet.svg'

export const Goblet = (props:TIconProps) => {
  return (<Icon {...props} Icon={GobletSvg} />)
}