
export type TGFileType = {
  ext: string
  type:string
  location:string
}

export type TGFileTypes = {
  [key:string]: TGFileType
}

export type TFileTreeNode = {
  id: string
  name: string
  type: string
  fileType: string
  location: string
  children?: TFileTreeNode[],
}

export type TFileTree = {
  nodes: Record<string, TFileTreeNode>
}

export type TFileType = {
  ext: string
  type: string
  location: string
  typeInName?: boolean
}

export type TFileTypes = Record<string, TFileType>