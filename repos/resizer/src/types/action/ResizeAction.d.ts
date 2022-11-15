import { PageSplitInput } from '../state';
export declare type ResizeAction = ResizeStartAction | ResizeMoveAction | ResizeEndAction;
export interface ResizeStartAction {
    readonly type: 'ResizeStart';
    readonly input: PageSplitInput;
    readonly index: number;
    readonly from: number;
}
export interface ResizeMoveAction {
    readonly type: 'ResizeMove';
    readonly to: number;
}
export interface ResizeEndAction {
    readonly type: 'ResizeEnd';
}
