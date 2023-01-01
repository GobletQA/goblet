import type { ComponentType } from 'react'

import { Form } from './Form'
import * as InputComponents from './Inputs'
import * as IconComponents from '@gobletqa/components/components'
import Grid from '@mui/material/Unstable_Grid2'

export const FormComponents:Record<any, ComponentType<any>> = {
  ...InputComponents,
  ...IconComponents,
  Form,
  Grid
}