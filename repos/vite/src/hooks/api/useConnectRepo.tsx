
import { ModalTypes } from '@constants'
import { useInline } from '@hooks/useInline'
import { connectRepo } from '@actions/repo/api/connect'
import { toggleModal } from '@actions/modals/toggleModal'
import { useConnectForm } from '@hooks/forms/useConnectForm'
import { setActiveModal } from '@actions/modals/setActiveModal'

export type THConnectRepo = ReturnType<typeof useConnectForm> & {
  values:Record<any, any>
  onConnect: (...args:any[]) => void
}

export const useConnectRepo = (props:THConnectRepo) => {
  const {
    values,
    loading,
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

      // TODO: investigate if this is needed
      // setRepoUrl('')
      // setBranch('')

      // // Close the modal
      toggleModal(false)

      // TODO: this was the only way, valide we don't do it this way any more
      // Open the selector modal to allow selecting a file from the mounted repo
      // setActiveModal(ModalTypes.repo)
  })
}
