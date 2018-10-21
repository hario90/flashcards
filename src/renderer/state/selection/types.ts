import { Deck } from "../deck/types";
import { MetadataStateBranch } from "../metadata/types";

export interface DeselectDeckAction {
    payload: string | string[];
    type: string;
}

export interface SelectionStateBranch {
    deck?: string;
}

export interface SelectDeckAction {
    payload: string | string[];
    type: string;
}

export interface SelectMetadataAction {
    key: keyof MetadataStateBranch;
    payload: string | number;
    type: string;
}
