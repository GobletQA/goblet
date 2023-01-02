import type { MouseEvent } from 'react'

import Box from '@mui/material/Box'
import { useCallback } from 'react'
import { useFeature } from '@GBR/contexts'
import { EmptyContainer, EmptyContent } from './Empty.styled'
import { BoltIcon, H4, Button, Span } from '@gobletqa/components'
import { createFeature } from '@gobletqa/race/actions/feature/createFeature'

export type Empty = {
  text?:string
}

const styles = {
  button: {padding: `6px 12px 6px 6px`},
  icon: {marginRight: `5px`, fontSize: `20px`},
}

export const Empty = (props:Empty) => {
  const { text=`Goblet Feature Editor` } = props
  const { rootPrefix } = useFeature()

  const onClick = useCallback((e:MouseEvent<HTMLButtonElement>) => {
    createFeature({}, rootPrefix)
  }, [rootPrefix])

  return (
    <EmptyContainer className='goblet-race-area-empty'>
      <EmptyContent>
        <H4>{text}</H4>
        <Box marginTop='5px'>
          Create a new feature, or select an existing feature from the panel on the right.
        </Box>
        <Box marginTop='20px'>
          <Button
            onClick={onClick}
            sx={styles.button}
            variant='contained'
          >
            <BoltIcon sx={styles.icon} />
            <Span>
              Create Feature
            </Span>
          </Button>
        </Box>
      </EmptyContent>
    </EmptyContainer>
  )
}