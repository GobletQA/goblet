import type { ComponentProps } from 'react'
import { Text } from './Text'

export type TTextEl = ComponentProps<typeof Text>

export const Paragraph = (props:TTextEl) => <Text component='p' {...props} />
export const Span = (props:TTextEl) => <Text component='span' {...props} />
