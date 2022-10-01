
import Box from '@mui/material/Box'
import { noOpObj } from '@keg-hub/jsutils'
import Typography from '@mui/material/Typography'

import { styled } from '@mui/material/styles'

const ReMain = styled(Box)(({theme}) => ({
  // flD: 'column',
  // alI: 'center',
  // jtC: 'center',
  // mT: theme.margin.size,
  // mB: theme.margin.size,
}))

const ReText = styled(Typography)(({theme}) => ({
  // ftSz: 14,
  // c: theme.tapColors.defaultLight,
}))

export type TOtherProviders = {
  [key:string]: any
}

export const OtherProviders = (props:TOtherProviders) => {
  const { styles = noOpObj } = props

  return (
    <ReMain style={styles.main}>
      <ReText style={styles.text}>More coming soon</ReText>
    </ReMain>
  )
}
