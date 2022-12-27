
import { useInline } from '@hooks/useInline'
import { clearFormCache } from '../form/FormCache'
import { connectForm } from '../forms/useConnectForm'
import { connectRepo } from '@actions/repo/api/connect'
import { toggleModal } from '@actions/modals/toggleModal'
import { useConnectForm } from '@hooks/forms/useConnectForm'

export type THConnectRepo = ReturnType<typeof useConnectForm> & {
  values:Record<any, any>
  onConnect: (...args:any[]) => void
}

export const useConnectRepo = (props:THConnectRepo) => {
  const {
    values,
    loading,
    setForm,
    onConnect,
    setLoading,
    setFormError,
  } = props

  return useInline(async () => {

    if(loading) return

    const { repo, ...params } = values
    setLoading(true)

    const resp = await connectRepo({
      ...params,
      repoUrl: repo.key
    })

    setLoading(false)
    onConnect?.(resp)

    if (!resp)
      return setFormError(`Failed to mount repo. Please try again later.`)

    // Reset form and close the modal, ensure the form cache is removed
    clearFormCache(connectForm?.form?.name)
    setForm({})
    toggleModal(false)

  })
}
