import type { TFileModel, TTestRunModel } from '../types'

declare module '@gobletqa/shared/models' {
  function fileModel(data:Partial<TFileModel>): TFileModel
  function testsModel(data:Partial<TTestsModel>): TTestsModel
  function testRunModel(data:Partial<TTestRunModel>): TTestRunModel
};