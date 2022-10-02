import ListItem from '@mui/material/ListItem'
import Button from '@mui/material/Button'
import ListItemText from '@mui/material/ListItemText'
import LoginIcon from '@mui/icons-material/Login'

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
        sx={{ width: `100%` }}
      >
        More coming soon
      </Button>
    </ListItem>
  )
}
