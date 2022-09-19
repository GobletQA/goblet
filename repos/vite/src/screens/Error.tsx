import { useRouteError } from "react-router-dom";
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

type RouteError = {
  message?: string
  statusText?: string
  [key: string]: any
}

export default function Error() {
  const error = useRouteError() as RouteError
  console.error(error)

  return (
    <Box id="error-page">
      <Typography component='h1' >Oops!</Typography>
      <Typography component="p" >Sorry, an unexpected error has occurred.</Typography>
      <Typography component="p" >
        {error.statusText || error.message}
      </Typography>
    </Box>
  );
} 

Error.element = `Error`