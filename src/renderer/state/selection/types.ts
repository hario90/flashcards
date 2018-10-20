import { Deck } from "../deck/types";
import { MetadataStateBranch } from "../metadata/types";

export interface DeselectFileAction {
    payload: string | string[];
    type: string;
}

export interface SelectionStateBranch {
    deck?: Deck;
}

export interface SelectFileAction {
    payload: string | string[];
    type: string;
}

export interface SelectMetadataAction {
    key: keyof MetadataStateBranch;
    payload: string | number;
    type: string;
}
