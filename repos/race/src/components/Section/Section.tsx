import type { TTextType } from '@gobletqa/components'
import type { ComponentProps, CSSProperties } from 'react'
import type { TSectionBody } from './SectionBody'
import type { TSectionHeader } from './SectionHeader'

import { EEditKey } from '@GBR/types'
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

export type TSection = TSectionBody & Omit<TSectionHeader, `editKey`|`title`> & {
  body?:boolean
  title?:string
  gutter?:boolean
  header?:boolean
  sx?:CSSProperties
  editKey?:EEditKey
  stack?:number|boolean
  styles?:TSectionStyles
  variant?:`outlined`|`filled`|`standard`
  stackProps?:ComponentProps<typeof Stack>
}

export const Section = (props:TSection) => {

  const {
    sx,
    type,
    body,
    title,
    stack,
    styles,
    gutter,
    header,
    variant,
    actions,
    editKey,
    children,
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

      {(header && editKey && (title || actions) && (
        <SectionHeader
          type={type}
          gutter={gutter}
          editKey={editKey}
          variant={variant}
          actions={actions}
          title={title || ``}
          sx={styles?.header}
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