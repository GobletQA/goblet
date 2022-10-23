import type { ComponentType } from 'react'

import { Form } from './Form'
import * as InputComponents from './Inputs'
import * as IconComponents from '@components/Icons'
import * as ButtonComponents from '@components/Buttons'
import Grid from '@mui/material/Unstable_Grid2'

export const FormComponents:Record<any, ComponentType<any>> = {
  ...InputComponents,
  ...IconComponents,
  ...ButtonComponents,
  Form,
  Grid
}