import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import LoginIcon from '@mui/icons-material/Login'
import { colors } from '@gobletqa/components/theme'

export type TOtherProviders = {
  [key:string]: any
}

export const OtherProviders = (props:TOtherProviders) => {

  return (
    <ListItem sx={{ minWidth: 120 }} >
      <Button
        disabled
        variant="contained"
        startIcon={<LoginIcon />}
        sx={{
          width: `100%`,
          color: `colors.white`,
          backgroundColor: colors.black09,
          [`&.Mui-disabled`]: {
            opacity: 0.4,
            color: colors.white,
            backgroundColor: colors.black09,
          }
        }}
      >
        More coming soon
      </Button>
    </ListItem>
  )
}
