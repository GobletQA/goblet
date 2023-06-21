import type { CSSProperties, ReactNode } from 'react'
import type { TOnAutoChange } from '@gobletqa/components'
import type { TRepoValueCB, TRepoInputError, TBuiltRepo, TBuiltRepos } from '@types'

import { PurpleText, gutter } from '@gobletqa/components'
import { Container, Text } from './FYI.styled'

export enum EFYIType {
  fyi=`fyi`,
  info=`info`,
  note=`note`,
  error=`error`,
  warning=`warning`,
}

export type TFYI = {
  type?:EFYIType
  text?:ReactNode
  sx?:CSSProperties
  children?:ReactNode
}


const FYITypes = {
  [EFYIType.fyi]: {
    container: {
      
    },
    text: {
      
    }
  },
  [EFYIType.info]: {
    container: {
      
    },
    text: {
      
    }
  },
  [EFYIType.note]: {
    container: {
      
    },
    text: {
      
    }
  },
  [EFYIType.error]: {
    container: {
      
    },
    text: {
      
    }
  },
  [EFYIType.warning]: {
    container: {
      
    },
    text: {
      
    }
  },
}


export const FYI = (props:TFYI) => {
  const {
    sx,
    text,
    children
  } = props
  
  return (
    <Container
      sx={sx}
      className='gb-fyi-container'
    >
      {children || text && (
        <Text className='gb-fyi-text'>
          {text}
        </Text>
      )}
    </Container>
  )
  
}