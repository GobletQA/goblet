import type { CSSProperties } from 'react'

import Box from '@mui/material/Box'
import { Container, Dropdown } from './Connect.styled'
import { PatForm } from '@components/Forms/PatForm'
import {
  dims,
  colors,
  gutter,
  H3,
  Text,
  Loading
} from '@gobletqa/components'

const styles = {
  container: {
    width: `100%`,
    display: `flex`,
    flexDirection: `column`,
  },
  wrapper: {
    paddingTop: gutter.padding.qpx,
    paddingBottom: gutter.padding.px,
  },
  bodySx:{
    marginTop: gutter.margin.hpx,
    paddingLeft: gutter.padding.px,
  },
  header: {
    opacity: 0.7,
    borderBottom : `0px`,
    color: colors.purple10,
    [`:hover`]: {
      opacity: 1,
      transition: `opacity ${dims.trans.avgEase}`,
    },
    [`& h5`]: {
      color: colors.purple10,
    }
  },
  expand: {
    color: colors.purple10
  }
}

export type TAddPat = {}

export const AddPat = (props:TAddPat) => {
  return (
    <Container
      sx={styles.container}
      className='gb-add-pat-container'
    >
      <Dropdown
        id='gb-add-pat'
        className='gb-add-pat'
        transformIconOff={0}
        transformIconOn={180}
        bodySx={styles.bodySx}
        headerSx={styles.header}
        expandIconSx={styles.expand}
        headerText={`Authentication`}
      >
        <Box
          sx={styles.wrapper}
          className='gb-add-pat-text'
        >
          <Text className='gb-add-pat-sub-text' variant="subtitle2">
            Some Git Providers limit the scope of their APIs. Add a Personal Access Token (PAT) from your Git Provider to ensure all repositories you have access to are available.
          </Text>
        </Box>
        <PatForm />
      </Dropdown>
    </Container>
  )

}