import type { TTextType } from '@gobletqa/components'
import type { ComponentProps, CSSProperties } from 'react'
import type { TSectionBody } from './SectionBody'
import type { TSectionHeader } from './SectionHeader'

import { exists } from '@keg-hub/jsutils'
import { SectionBody } from './SectionBody'
import { SectionHeader } from './SectionHeader'
import { Container, Stack } from './Section.styled'

type TSectionStyles = {
  section?: CSSProperties
  header?: CSSProperties
  body?: CSSProperties
  stack?: CSSProperties
}

export type TSection = TSectionBody & TSectionHeader & {
  body?:boolean
  gutter?:boolean
  header?:boolean
  sx?:CSSProperties
  variant?:TTextType
  stack?:number|boolean
  underline?:boolean
  styles?:TSectionStyles
  stackProps?:ComponentProps<typeof Stack>
}

export const Section = (props:TSection) => {

  const {
    sx,
    type,
    Icon,
    body,
    title,
    stack,
    styles,
    gutter,
    header,
    variant,
    actions,
    children,
    underline,
    stackProps,
  } = props

  return (
    <Container
      className='gr-section'
      sx={[
        sx as CSSProperties,
        styles?.section as CSSProperties
      ]}
    >

      {(header && (title || Icon || actions) && (
        <SectionHeader
          type={type}
          Icon={Icon}
          title={title}
          gutter={gutter}
          variant={variant}
          actions={actions}
          sx={styles?.header}
          underline={underline}
        />
      )) || null}

      {
        body
          ? (
              <SectionBody
                type={type}
                gutter={gutter}
                sx={styles?.body}
                children={children}
              />
            )
          : exists(stack) || stackProps
            ? (
                <Stack
                  spacing={stack}
                  {...stackProps}
                  gutter={gutter}
                  sx={styles?.stack}
                  children={children}
                  className='gr-section-stack'
                />
              )
            : children
      }
    </Container>
  )
}