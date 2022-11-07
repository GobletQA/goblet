import type { Repo } from '../../repo/repo'
import type { TTreeNodeModel } from '../../types'

import fs from 'fs'
import path from 'path'
import { treeNodeModel } from '@GSH/models'
import { limboify } from '@keg-hub/jsutils'
import { fileSys } from '@keg-hub/cli-utils'
import { resolveFileType } from '@GSH/utils/resolveFileType'
import { getRepoGobletDir } from '@GSH/utils/getRepoGobletDir'

const { getFolderContent } = fileSys

/**
 * Recursively checks to find the parent node for a given item
 * if a parent exists, it will add it as a child
 * @param nodes
 * @param parentPath
 * @param newItem
 *
 * @returns - whether a parent node exists and push was successful
 */
export const parentNodeExists = (
  nodes:TTreeNodeModel[],
  parentPath:string,
  newItem:Record<any, any>
) => {
  const found = nodes.find(node => {
    return node.location === parentPath
      ? Boolean(node.children.push(newItem.id)) && nodes.push(newItem as TTreeNodeModel)
      : node.children &&
          node.children.length &&
          parentNodeExists(node.children, parentPath, newItem)
  })

  return Boolean(found)
}

/**
 * Gets the metadata of a path from the local filesystem
 * @param filePath - full path to the folder or file i.e '/goblet/app/tests/bdd/features'
 *
 * @returns - Meta data containing {name, parent, type ( folder || file )} properties
 */
export const getPathMeta = async (filePath:string) => {
  const [_, stat] = await limboify(fs.stat, filePath)
  const isDir = stat.isDirectory()
  
  return {
    id: filePath,
    location: filePath,
    name: path.basename(filePath),
    parent: path.dirname(filePath),
    type: isDir ? 'folder' : 'file',
  }
}

/**
 * Transforms the paths string to a specific data object
 * @param paths - full paths to the folder or file i.e '/goblet/app/tests/bdd/features'
 *
 * @returns  - each object has the form:
 *                            {id, location, children: [], modified}
 */
export const getPathNodes = async (
  paths:string[],
  repo:Repo
) => {
  /**
   * 1. create new object for each 'path' item
   * 2. if the parent path of current 'path' item exists, add it as the child
   */
  return await paths.reduce(async (toResolve, filePath) => {
    const nodes = await toResolve

    // Get the meta data for this path
    const { parent, ...pathMeta } = await getPathMeta(filePath)

    // Ignore hidden files that start with a .
    if (pathMeta.type === 'file' && pathMeta.name.startsWith('.')) return nodes

    const node = treeNodeModel({
      children: [],
      ...pathMeta,
      fileType: resolveFileType(repo, filePath),
    })

    // either push the node or add it to an existing node.children
    ;(!nodes.length || !parentNodeExists(nodes, parent, node)) &&
      nodes.push(node)

    return nodes
  }, Promise.resolve([]))
}

/**
 * Returns an array of root paths
 * @param fullPaths
 * @param repoRoot
 *
 * @returns - filtered paths
 */
export const getRootPaths = (
  fullPaths:string[],
  repoRoot:string
) => {
  return fullPaths.filter(fullPath => path.dirname(fullPath) === repoRoot)
}

export const buildFileTree = async (repo:Repo) => {
  const searchOpts = {
    full: true,
    recursive: true,
    // Exclude specific dot files
    exclude: [
      `.DS_Store`,
      `.gitignore`,
      `.gitkeep`,
      `.keep`,
      `node_modules`,
      `.goblet-empty-status.json`,
    ],
  }

  // Get all the paths from the testRoot directory
  const baseDir = getRepoGobletDir(repo)
  const paths = await getFolderContent(baseDir, searchOpts)
  const nodes = await getPathNodes(paths, repo)
  const rootPaths = await getRootPaths(paths, baseDir)

  return { paths, nodes, rootPaths }
}
