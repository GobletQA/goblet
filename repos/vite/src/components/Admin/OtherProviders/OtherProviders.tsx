import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import { useColor } from '@hooks/theme/useColor'
import LoginIcon from '@mui/icons-material/Login'

export type TOtherProviders = {
  [key:string]: any
}

export const OtherProviders = (props:TOtherProviders) => {
  
  const bgColor = useColor(`colors.gray10`, `colors.black05`)
  
  return (
    <ListItem sx={{ minWidth: 120 }} >
      <Button
        disabled
        variant="contained"
        startIcon={<LoginIcon />}
        sx={{
          width: `100%`,
          color: `colors.white00`,
          backgroundColor: bgColor,
          [`&.Mui-disabled`]: {
            opacity: 0.5,
            color: `colors.gray04`,
            backgroundColor: bgColor,
          }
        }}
      >
        More coming soon
      </Button>
    </ListItem>
  )
}
