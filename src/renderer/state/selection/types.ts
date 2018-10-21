import { MetadataStateBranch } from "../metadata/types";

export interface DeselectDeckAction {
    payload: number | number[];
    type: string;
}

export interface SelectionStateBranch {
    deck?: number;
}

export interface SelectDeckAction {
    payload: number | number[];
    type: string;
}

export interface SelectMetadataAction {
    key: keyof MetadataStateBranch;
    payload: string | number;
    type: string;
}
