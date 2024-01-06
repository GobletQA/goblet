import type { TExFileModel } from '@GEX/types'

import { findFileType } from '../findFileType'
import { FileTypeMap } from "@GEX/constants/constants"

describe(`findFileType`, () => {
  const extMap: Record<string, string> = {
    txt: `text`,
    csv: `csv`,
  }

  const mockFile: TExFileModel = {
    ast: {},
    ext: `json`,
    name: `test`,
    fileType: `json`,
    transformed: undefined,
    content: `{"key": "value"}`,
    location: `/path/to/test.json`,
  }

  it(`should return the mapped file type based on fileType property if present in FileTypeMap`, () => {
    const fileType = findFileType(mockFile, extMap)

    expect(fileType).toEqual(FileTypeMap.json)
  })

  it(`should return the mapped file type based on extension if fileType property is not present in FileTypeMap`, () => {
    expect(findFileType({
      ...mockFile,
      fileType: ``,
    }, extMap)).toEqual(FileTypeMap.json)
  })

  it(`should return undefined if the fileType, extension and location do not provided a mapped type`, () => {
    expect(findFileType({
      ...mockFile,
      ext: ``,
      fileType: ``,
      location: `/path/to/some/other/location/test`
    }, extMap)).toEqual(undefined)
  })

  it(`should return the mapped file type from the extension mapping when a custom extension map is passed in`, () => {
    const fileWithMappedExtension: TExFileModel = {
      ...mockFile,
      ext: `txt`,
      fileType: `txt`,
      location: `/path/to/test.txt`,
    }

    const fileType = findFileType(fileWithMappedExtension, extMap)

    expect(fileType).toEqual(`text`)
  })

  it(`should return the fileType mapped type over the ext and location properties`, () => {
    expect(findFileType({
      ...mockFile,
      ext: `json`,
      fileType: `txt`,
      location: `/path/to/some/other/location/test.json`
    }, extMap)).toEqual(`text`)
  })

  it(`should return the ext mapped type over the location property when fileType is undefined`, () => {
    expect(findFileType({
      ...mockFile,
      ext: `txt`,
      fileType: undefined,
      location: `/path/to/some/other/location/test.json`
    }, extMap)).toEqual(`text`)
  })

  it(`should return the location mapped type when fileType and ext properties are undefined`, () => {
    expect(findFileType({
      ...mockFile,
      ext: undefined,
      fileType: undefined,
      location: `/path/to/some/other/location/test.txt`
    }, extMap)).toEqual(`text`)
  })

})
