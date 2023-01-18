import type { THFormHelpers, TSetupForm } from '@types'

import { noOpObj } from '@keg-hub/jsutils'
import { useState, useCallback } from 'react'
import { getRepos } from '@actions/repo/api/getRepos'
import { useBuildForm } from '@hooks/form/useBuildForm'
import { evtFnNoOp } from '@hooks/form/useBuildFormValues'
import { signOutReload } from '@actions/admin/user/signOutReload'

export const connectForm = {
  form: {
    name: `connect-form`,
    values: {
      repo: ``,
      branch: ``,
    },
  },
  // $root: {
  //   rowSpacing: 2,
  //   container: true,
  //   columnSpacing: 1,
  //   disableEqualOverflow: true
  // },
  // $actions: {
  //   signOut: {
  //     label: `Sign Out`,
  //     onClick: signOutReload,
  //     variant: `text`  as const,
  //     color: `secondary` as const,
  //     StartIcon: `$component.LogoutIcon`,
  //   },
  //   connectRepo: {
  //     color: `primary`  as const,
  //     variant: `contained`  as const,
  //     label: `Connect Repo`,
  //     disabled: `$values.no.branch`,
  //     StartIcon: `$component.CloudDownIcon`,
  //   }
  // },
  fields: {
    repo: {
      Component: `AutoInput`,
      required: true,
      name: `repo`,
      gridProps: {
        xs: 12,
      },
      label: `Select Repo`,
      decor: {
        name: `syncRepos`,
        color: `secondary`,
        labelPos: `bottom`,
        onClick: getRepos,
        label: `Sync Repos`,
        Icon: `$component.SyncIcon`,
        buttonProps: { size: `small` },
        iconProps:{ fontSize: `small` },
        Component: `$component.IconButton`,
      },
      textFieldProps: {
        placeholder: `Select a repo to connect to...`,
      },
      rules: {
        required: `Please select a repository`
      }
    },
    branch: {
      Component: `AutoInput`,
      required: true,
      name: `branch`,
      label: `Select Branch`,
      gridProps: {
        xs: 12,
      },
      textFieldProps: {
        inputProps: {},
        placeholder: `Select the branch to use...`,
      },
      rules: {
        required: `Please select a branch`
      }
    },
    createBranch: {
      name: `createBranch`,
      label: `Create Branch`,
    },
    newBranch: {
      Component: `Input`,
      active: false,
      disabled: `$values.no.createBranch`,
      gridProps: {
        xs: 12,
      },
      name: `newBranch`,
      label: `Create New Branch`,
      placeholder: `Enter a branch name...`,
      decor: {
        adornmentProps: {},
        onClick: evtFnNoOp,
        labelPos: `bottom`,
        // label: `New Branch`,
        name: `createBranch`,
        disabled: `$values.no.branch`,
        active: `$values.is.createBranch`,
        Component: `$component.IconToggle`,
        Icon: `$component.SubArrowRightIcon`,
        iconProps:{ fontSize: `small` },
        labelSx: {
          [`> .MuiFormControlLabel-label`]: {
            fontSize: `10px`,
            marginTop: `-5px`,
          }
        }
      },
    }
  }
}

export type TConnectForm = THFormHelpers & {
  setupForm?: TSetupForm
  values?:Record<any, any>
  onConnect?: (...args:any[]) => void
}

export const useConnectForm = (props:TConnectForm=noOpObj as TConnectForm) => {
  const [values, setForm] = useState<Record<any, any>>(props.values || {})

  const {
    form,
    loading,
    onSuccess,
    formError,
    setLoading,
    setFormError,
  } = useBuildForm(connectForm, {
    ...props,
    values,
    setForm,
    pathValues: {
      [`newBranch.decor.onClick`]: useCallback((evt:any) => {
        setForm({
          ...values,
          createBranch: evt.target.checked
        })
      }, [values])
    }
  })

  return {
    form,
    values,
    loading,
    setForm,
    formError,
    onSuccess,
    setLoading,
    setFormError
  }
}