import type { THFormHelpers, TSetupForm } from '@types'

import { noOpObj } from '@keg-hub/jsutils'
import { useState, useCallback } from 'react'
import { useBuildForm } from '@hooks/form/useBuildForm'
import { evtFnNoOp } from '@hooks/form/useBuildFormValues'
import { signOutAuthUser } from '@actions/admin/provider/signOutAuthUser'

const formFields = {
  form: {
    name: `connect-form`,
    values: {
      repo: ``,
      branch: ``,
    },
  },
  $root: {
    rowSpacing: 2,
    container: true,
    columnSpacing: 1,
    disableEqualOverflow: true
  },
  $actions: {
    signOut: {
      label: `Sign Out`,
      onClick: signOutAuthUser,
      variant: `text`  as const,
      color: `secondary` as const,
      StartIcon: `$component.CloudDownIcon`,
    },
    connectRepo: {
      color: `primary`  as const,
      variant: `contained`  as const,
      label: `Connect Repo`,
      disabled: `$values.not.branch`,
      StartIcon: `$component.CloudDownIcon`,
    }
  },
  fields: {
    repo: {
      Component: `AutoInput`,
      required: true,
      name: `repo`,
      gridOptions: {
        xs: 12,
      },
      label: `Select Repo`,
      decor: {
        name: `syncRepos`,
        color: `secondary`,
        Icon: `$component.SyncIcon`,
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
      gridOptions: {
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
      disabled: `$values.not.createBranch`,
      gridOptions: {
        xs: 12,
      },
      name: `newBranch`,
      label: `Branch Name`,
      placeholder: `Enter a branch name...`,
      decor: {
        disabled: `$values.not.branch`,
        active: `$values.is.createBranch`,
        onClick: evtFnNoOp,
        labelPos: 'bottom',
        label: 'New Branch',
        name: 'createBranch',
        Component: `$component.IconToggle`,
        Icon: `$component.SubArrowRightIcon`,
        iconProps:{ fontSize: 'small' },
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
  } = useBuildForm(formFields, {
    ...props,
    values,
    setForm,
    pathValues: {
      [`newBranch.decor.onClick`]: useCallback((evt:any) => {
        setForm({ ...values, createBranch: evt.target.checked })
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
    setFormError,
  }
}