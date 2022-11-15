import { PageSplitInput } from './PageSplitInput';
export interface PageSplitDrag {
    readonly input: PageSplitInput;
    readonly index: number;
    readonly sizes: number[];
    readonly from: number;
    readonly to?: number;
}
