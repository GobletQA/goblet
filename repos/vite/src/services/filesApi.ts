import type { TFileResp } from '@types'
import type { TRequest } from '@services/axios.types'

import { HttpMethods } from '@constants'
import { apiRequest } from '@utils/api/apiRequest'
import { buildRepoReq } from '@utils/api/apiHelpers'

export type TSaveFile = {
  type:string
  content:string
  location:string
}
export type TCreateFile = {
  type:string
  content?:string
  location:string
}

export type TDeleteFileRep = {
  success:boolean
  location:string
}

export type TRenameFile = {
  oldLoc:string
  newLoc:string
  content?:string
}

export type TLoadFile = {
  location:string
}


class FilesApi {

  /**
   * Internal method, that all other methods call to make an API request
   * @private
   */
  _req = async <T>(opts:string|TRequest) => await apiRequest<T>(buildRepoReq(opts))

  loadFile = async <T=TFileResp>(location:string) => await this._req<T>(`/files/load?location=${location}`)

  loadGobletFile = async <T=TFileResp>(location:string) => await this._req<T>(
    `/files/definition?location=${location}`
  )

  deleteFile = async <T=TDeleteFileRep>(location:string) => await this._req<T>({
    method: `DELETE`,
    url: `/files/delete`,
    params: { location },
  })

  saveFile = async <T=TFileResp>({
    type,
    content,
    location,
    ...saveFile
  }:TSaveFile) => await this._req<T>({
    url: `/files/save`,
    method: HttpMethods.POST,
    params: {
      type,
      content,
      location,
    },
  })

  createFile = async <T=TFileResp>({
    type,
    content,
    location
  }:TCreateFile) => await this._req<T>({
    method: HttpMethods.POST,
    url: `/files/create`,
    params: { content, location, type },
  })

  renameFile = async <T=TFileResp>({
    oldLoc,
    newLoc,
    content,
  }:TRenameFile) => await this._req<T>({
    url: `/files/rename`,
    method: HttpMethods.POST,
    params: {
      oldLoc,
      newLoc,
      content
    },
  })

}

export const filesApi = new FilesApi()