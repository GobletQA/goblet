
import Box from '@mui/material/Box'
import { EmptyContainer, EmptyContent } from './Empty.styled'
import { BoltIcon, H4, Button, Span } from '@gobletqa/components'
import { createFeature } from '@gobletqa/race/actions/feature/createFeature'

export type Empty = {
  text?:string
}

export const Empty = (props:Empty) => {
  const { text=`Goblet Feature Editor` } = props

  return (
    <EmptyContainer className='goblet-race-area-empty'>
      <EmptyContent>
        <H4>{text}</H4>
        <Box marginTop='5px'>
          Create a new feature, or select an existing feature from the panel on the right.
        </Box>
        <Box marginTop='20px'>
          <Button
            variant='contained'
            onClick={() => createFeature({})}
            sx={{ padding: `6px 12px 6px 6px`, }}
          >
            <BoltIcon sx={{ marginRight: `5px`, fontSize: `20px` }} />
            <Span>
              Create Feature
            </Span>
          </Button>
        </Box>
      </EmptyContent>
    </EmptyContainer>
  )
}