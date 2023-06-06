import {useMemo} from "react"
import {EAppStatus} from "@types"
import {useApp, useRepo, useUser} from "@store"

export const useShowBrowser = () => {
  const user = useUser()
  const repo = useRepo()
  const { status } = useApp()

  return useMemo(
    () => {
      const isActive = status === EAppStatus.Active
      return {
        isActive,
        showBrowser: isActive && Boolean(user.id && repo.name)
      }
    },
    [user, repo]
  )
}