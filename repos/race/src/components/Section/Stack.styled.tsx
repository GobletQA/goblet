
import Box from '@mui/material/Box'
import MuiStack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import type { TGobletTheme } from '@gobletqa/components'
import type { ComponentProps, ComponentType } from 'react'

export type TGutterComp = ComponentProps<typeof Box> & {
  gutter?:boolean
  theme?:TGobletTheme
}

export const GutterComp = (Component:ComponentType<any>, styles:string=``) => {
  return styled(Component, {
    shouldForwardProp: (prop:string) => prop !== 'gutter'
  })(({ theme, gutter }:TGutterComp) => {
      return `
        width: 100%;
        ${styles}
        ${
          gutter
            ? [
                `padding-left: ${theme?.gutter?.padding?.px};`,
                `padding-right: ${theme?.gutter?.padding?.px};`
              ].join(`\n`)
            : ``
        }
      `
  })

}

export const StackContainer = styled(Box)`
  width: 100%;
  height: 100%;
`

export const StackContent = GutterComp(MuiStack, `
  width: 100%;
  height: 100%;
  & > .MuiBox-root {
    margin-top: 0px
  }
`)

export const StackBody = GutterComp(Box)
