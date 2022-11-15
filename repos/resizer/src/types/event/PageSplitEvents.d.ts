import { ResizeEndEvent, ResizeMoveEvent, ResizeStartEvent } from './PageSplitEvent';
import { PageSplitEventHandler } from './PageSplitEventHandler';
export interface PageSplitEvents {
    readonly onResizeStart?: PageSplitEventHandler<ResizeStartEvent>;
    readonly onResizeMove?: PageSplitEventHandler<ResizeMoveEvent>;
    readonly onResizeEnd?: PageSplitEventHandler<ResizeEndEvent>;
}
