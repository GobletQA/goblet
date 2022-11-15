import { PageSplitEvent } from './PageSplitEvent';
export interface PageSplitEventHandler<T extends PageSplitEvent> {
    (event: T): void;
}
