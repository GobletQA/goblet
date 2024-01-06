import path from 'node:path'
import { globMatch, globMatchFiles } from '../globMatch'
import {
  mocksDir,
  ExamConfig
} from '../../../__mocks__'


const globOpts = {
  // Disabled absolute because the path changes base on the machine
  dot: true,
  absolute: false,
  cwd: path.join(mocksDir, `glob`)
}

const examNoExt = {...ExamConfig, matchExtensions: false}

describe(`globMatch`, () => {

  describe(`globMatchFiles`, () => {

    it(`should find files matching the file name and default extensions`, async () => {
      const resp = await globMatchFiles(ExamConfig, [`test`], globOpts)
      expect(resp).toEqual([
        `sub-path/test.js`,
        `sub-path/test.ts`,
        `test.js`,
        `test.ts`
      ])
      expect(resp.includes(`test.feature`)).toBe(false)
      expect(resp.includes(`sub-path/test.feature`,)).toBe(false)
    })

    it(`should find files only with a custom extension`, async () => {
      const resp = await globMatchFiles({...ExamConfig, extensions: [`.feature`]}, [`test`], globOpts)
      expect(resp).toEqual([
        `sub-path/test.feature`,
        `test.feature`
      ])
      expect(resp.includes(`test.js`)).toBe(false)
      expect(resp.includes(`test.ts`)).toBe(false)
    })

    it(`should find all sub-path files when only sub folder is passed`, async () => {
      const resp = await globMatchFiles(ExamConfig, [`sub-path`], globOpts)
      expect(resp).toEqual([
        `sub-path/test.js`,
        `sub-path/test.ts`,
      ])
      expect(resp.includes(`sub-path/sub-skip.txt`)).toBe(false)
    })

    it(`should find all sub-path files with custom extension and sub folder is passed`, async () => {
      const resp = await globMatchFiles({...ExamConfig, extensions: [`.feature`]}, [`sub-path`], globOpts)
      expect(resp).toEqual([
        `sub-path/test.feature`,
      ])
    })

    it(`should find all files when extensions is empty and empty string is passed`, async () => {
      const resp = await globMatchFiles({...ExamConfig, extensions: []}, [``], globOpts)
      expect(resp).toEqual([
        `skip.txt`,
        `sub-path/sub-skip.txt`,
        `sub-path/test.feature`,
        `sub-path/test.js`,
        `sub-path/test.ts`,
        `test.feature`,
        `test.js`,
        `test.ts`,
      ])
    })

    it(`should find all sub-path files when extensions is empty and a sub-path is passed`, async () => {
      const resp = await globMatchFiles({...ExamConfig, extensions: []}, [`sub-path`], globOpts)
      expect(resp).toEqual([
        `sub-path/sub-skip.txt`,
        `sub-path/test.feature`,
        `sub-path/test.js`,
        `sub-path/test.ts`,
      ])
    })

    it(`should find only files matching the file name and no matchExtensions`, async () => {
      const resp = await globMatchFiles(examNoExt, [`test`], globOpts)
      expect(resp).toEqual([
        `sub-path/test.feature`,
        `sub-path/test.js`,
        `sub-path/test.ts`,
        `test.feature`,
        `test.js`,
        `test.ts`
      ])
    })

    it(`should find only files with included extension, and no matchExtensions`, async () => {
      const resp = await globMatchFiles(examNoExt, [`test.ts`], globOpts)
      expect(resp).toEqual([
        `sub-path/test.ts`,
        `test.ts`
      ])
    })

    it(`should find files by matching extension, and no matchExtensions`, async () => {
      const resp = await globMatchFiles(examNoExt, [`feature`], globOpts)
      expect(resp).toEqual([
        `sub-path/test.feature`,
        `test.feature`
      ])
    })

    it(`should find sub-path files when its included in the match, and no matchExtensions`, async () => {
      const resp = await globMatchFiles(examNoExt, [`sub-path/test`], globOpts)
      expect(resp).toEqual([
        `sub-path/test.feature`,
        `sub-path/test.js`,
        `sub-path/test.ts`,
      ])
    })

    it(`should find all sub-path files when only sub folder is passed, and no matchExtensions`, async () => {
      const resp = await globMatchFiles(examNoExt, [`sub-path`], globOpts)
      expect(resp).toEqual([
        `sub-path/sub-skip.txt`,
        `sub-path/test.feature`,
        `sub-path/test.js`,
        `sub-path/test.ts`,
      ])
    })

  })

})
