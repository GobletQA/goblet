import Box from '@mui/material/Box'
import { Button } from '@components/Buttons/Button'

export type TEnvironments = {
  
}

export const Environments = (props:TEnvironments) => {

  return (
    <Box
      sx={{
        marginTop: `10px`,
        display: `flex`,
        alignContent: `center`,
        justifyContent: `center`,
      }}
    >
      <Button>
        Add Environment
      </Button>
    </Box>
  )

}