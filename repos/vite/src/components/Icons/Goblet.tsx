import { Icon, TIconProps } from './Icon'
import GobletSvg from '@assets/goblet.svg'
import { colors } from '@gobletqa/components/theme'

export const Goblet = (props:TIconProps) => {
  return (<Icon fill={colors.royalPurple} {...props} Icon={GobletSvg} />)
}