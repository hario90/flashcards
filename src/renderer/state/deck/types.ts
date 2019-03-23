export interface DeckStateBranch {
    decks: Deck[];
    draft?: Deck;
}

export interface Card {
    front: string;
    back: string;
    middle?: string;
}

export interface RawDeck {
    id: number;
    name: string;
    type: "BASIC" | "THREE_WAY";
}

export interface Deck extends RawDeck {
    cards: Card[];
}

export interface CardResponse extends Card {
    deckId: number;
}

export interface CreateDeckAction {
    payload: Deck;
    type: string;
}

export interface SaveDeckAction {
    type: string;
}

export interface SaveDraftAction {
    payload: Deck;
    type: string;
}

export interface DeleteDeckAction {
    payload: number;
    type: string;
}

export interface SetDecksAction {
    payload: Deck[];
    type: string;
}

export interface ClearDraftAction {
    type: string;
}

export interface ClearDecksAction {
    type: string;
}
