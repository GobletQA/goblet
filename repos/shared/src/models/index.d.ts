import type { TFileModel, TTreeNodeModel, TTestRunModel } from '../types'

declare module '@gobletqa/shared/models' {
  function fileModel(data:Partial<TFileModel>): TFileModel
  function treeNodeModel(data:Partial<TTreeNodeModel>): TTreeNodeModel
  function testsModel(data:Partial<TTestsModel>): TTestsModel
  function testRunModel(data:Partial<TTestRunModel>): TTestRunModel
};