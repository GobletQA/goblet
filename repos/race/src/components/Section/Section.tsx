import type { TEditingProps } from '@GBR/types'
import type { TSectionBody } from './SectionBody'
import type { TSectionHeader } from './SectionHeader'
import type { TTextType } from '@gobletqa/components'
import type { ComponentProps, CSSProperties } from 'react'

import { exists } from '@keg-hub/jsutils'
import { SectionBody } from './SectionBody'
import { SectionHeader } from './SectionHeader'
import { Container, Stack } from './Section.styled'

type TSectionStyles = {
  body?: CSSProperties
  stack?: CSSProperties
  section?: CSSProperties
  header?: CSSProperties
}

export type TSection = TSectionBody & TSectionHeader & TEditingProps & {
  body?:boolean
  gutter?:boolean
  header?:boolean
  sx?:CSSProperties
  variant?:TTextType
  underline?:boolean
  stack?:number|boolean
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
    editing,
    children,
    underline,
    setEditing,
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
          editing={editing}
          variant={variant}
          actions={actions}
          sx={styles?.header}
          underline={underline}
          setEditing={setEditing}
        />
      )) || null}

      {
        body
          ? (
              <SectionBody
                type={type}
                gutter={gutter}
                editing={editing}
                sx={styles?.body}
                children={children}
                setEditing={setEditing}
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