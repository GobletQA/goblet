import type { TBuiltForm, TFormRootProps, TFormActions } from '@types'

import { noOpObj, isStr } from '@keg-hub/jsutils'
import Grid from '@mui/material/Unstable_Grid2'
import { FormComponents } from '@components/Form'

export type TRenderInputs = Record<`form`, TBuiltForm>
  & Record<'disableAll', boolean>
  & Record<string, any>


export const RenderInputs = (props:Record<any, any>) => {
  const { disableAll } = props
  const {
    form,
    $actions=noOpObj as TFormActions,
    $root=noOpObj as TFormRootProps,
    ...fields
  } = props.form as TBuiltForm

  const {
    Component=Grid,
    ...rootRest
  } = $root

  const disabledProps = disableAll ? { disabled: disableAll } : noOpObj

  return (
      <Component {...rootRest} >
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
                <Comp
                  {...rest}
                  {...inputProps}
                  {...disabledProps}
                />
              </GridComp>
            )

          return Inputs
        }, [] as JSX.Element[])
      }
    </Component>
  )
}
