import { Resize } from '../resize';
import { PanelsAction } from './PanelsAction';
import { ResizeAction } from './ResizeAction';
export declare type PageSplitAction = SetResizeAction | PanelsAction | ResizeAction;
export interface SetResizeAction {
    readonly type: 'SetResize';
    readonly resize: Resize;
}
