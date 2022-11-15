import { PageSplitInput } from '../state';
export interface ResizeState {
    readonly input: PageSplitInput;
    readonly index: number;
    readonly sizes: number[];
    readonly from: number;
    readonly to: number;
}
