import type { CSSProperties } from 'react'


import { Loading, ClockIcon } from '@gobletqa/components'

import {
  TextInfo,
  TextContainer,
  LoadingContainer,
} from './ScreencastLoading.styled'


export type TScreencastLoading = {
  isActive?:boolean
  sx?: CSSProperties
}

export const ScreencastLoading = (props:TScreencastLoading) => {
  return (
    <LoadingContainer
      sx={props.sx}
      className='gb-screencast-loading'
    >
      {
        props.isActive
          ? (
              <Loading
                pos='after'
                message='Loading...'
              />
            )
          : (
              <TextContainer>
                <ClockIcon />
                <TextInfo>
                  Inactive User
                </TextInfo>
              </TextContainer>
            )
      }
    </LoadingContainer>
  )
}