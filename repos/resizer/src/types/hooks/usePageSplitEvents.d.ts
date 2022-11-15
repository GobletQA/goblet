import { PageSplitEvent, PageSplitEvents } from '../event';
export interface UsePageSplitEventsProps extends PageSplitEvents {
    readonly event: PageSplitEvent | null;
}
export declare function usePageSplitEvents(props: UsePageSplitEventsProps): void;
