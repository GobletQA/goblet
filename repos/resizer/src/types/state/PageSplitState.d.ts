/// <reference types="react" />
import { BoundingSize } from '../dom';
import { PageSplitEvent } from '../event';
import { Resize } from '../resize';
import { PageSplitDrag } from './PageSplitDrag';
import { PageSplitPanelsState } from './PageSplitPanelsState';
export interface PageSplitState {
    readonly boundingSize: BoundingSize;
    readonly resize: Resize;
    readonly panels: PageSplitPanelsState;
    readonly drag: PageSplitDrag | null;
    readonly event: PageSplitEvent | null;
}
export declare const EmptyPageSplitState: PageSplitState;
export declare const PageSplitStateContext: import("react").Context<PageSplitState>;
