import { ResizeState } from './ResizeState';
export interface Resize {
    (state: ResizeState): number[];
}
