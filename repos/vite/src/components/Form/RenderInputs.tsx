import type { TBuiltForm } from '@hooks/forms'

import { noOpObj, isStr } from '@keg-hub/jsutils'
import Grid from '@mui/material/Unstable_Grid2'
import { FormComponents } from '@components/Form'

export type TRenderInputs = Record<`form`, TBuiltForm> & Record<string, any>

export const RenderInputs = (props:Record<any, any>) => {
  const {
    form,
    $root,
    ...fields
  } = props.form as TBuiltForm

  return (
    <>
      {
        Object.entries(fields).reduce((Inputs, [name, inputOpts]) => {
          const {
            Component,
            gridOptions,
            Grid:GridComp=Grid,
            ...rest
          } = inputOpts
          
          const Comp = isStr<keyof typeof FormComponents>(Component)
            ? FormComponents[Component]
            : Component

          const inputProps = props[name] || noOpObj

          Comp &&
            Inputs.push(
              <GridComp key={name} {...gridOptions}>
                <Comp {...rest} {...inputProps} />
              </GridComp>
            )

          return Inputs
        }, [] as JSX.Element[])
      }
    </>
  )
}
