import { Card } from "../deck/types";
import { MetadataStateBranch } from "../metadata/types";

export interface DeselectDeckAction {
    payload: number | number[];
    type: string;
}

export interface SelectionStateBranch extends LearnStateBranch {
    deck?: number;
}

export interface LearnStateBranch {
    currentCard?: Card;
    seenCards: Card[];
    unseenCards: Card[];
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

export interface ResetDeckAction {
    payload: Card[];
    type: string;
}

export interface GetNextCardAction {
    type: string;
}

export interface GetPreviousCardAction {
    type: string;
}

export interface SetCurrentCardAction {
    payload?: Card;
    type: string;
}

export interface SetSeenCardsAction {
    payload: Card[];
    type: string;
}

export interface SetUnseenCardsAction {
    payload: Card[];
    type: string;
}
