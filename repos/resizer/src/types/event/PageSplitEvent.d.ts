import { PageSplitInput } from '../state';
export declare type PageSplitEvent = ResizeStartEvent | ResizeMoveEvent | ResizeEndEvent;
export interface ResizeStartEvent {
    readonly type: 'ResizeStart';
    readonly input: PageSplitInput;
    readonly index: number;
    readonly from: number;
}
export interface ResizeMoveEvent {
    readonly type: 'ResizeMove';
    readonly to: number;
}
export interface ResizeEndEvent {
    readonly type: 'ResizeEnd';
}
