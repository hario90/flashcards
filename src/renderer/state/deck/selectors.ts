import { find } from "lodash";
import { createSelector } from "reselect";

import { getSelectedDeckId } from "../selection/selectors";
import { State } from "../types";

import { Card, Deck } from "./types";

export const getDecks = (state: State) => state.deck.decks;
export const getDraft = (state: State) => state.deck.draft;

const cardsAreEqual = (card1: Card, card2: Card) => card1.front === card2.front && card1.back === card2.back;

export const getSelectedDeck = createSelector([
    getSelectedDeckId,
    getDecks,
], (deckId: number | undefined, decks: Deck[]) => {
    if (!deckId) {
        return undefined;
    }

    return decks.find((deck: Deck) => deck.id === deckId);
});

export const unsavedChanges = createSelector([getSelectedDeck, getDraft], (
    selected?: Deck,
    draft?: Deck
): boolean => {
    if (!selected || !draft) {
        return false;
    }

    const nameChanged = selected.name !== draft.name;
    const { cards: draftCards } = draft;
    const { cards: savedCards } = selected;
    const notEmptyDraftCards = draftCards.filter((card: Card) => card.front || card.back);

    let cardsChanged: boolean = false;
    savedCards.forEach((card) => {
        const matchingCard: Card | undefined = find(notEmptyDraftCards, (draftCard) => cardsAreEqual(card, draftCard));
        if (!matchingCard) {
            cardsChanged = true;
            return;
        }
    });

    cardsChanged = cardsChanged || savedCards.length !== notEmptyDraftCards.length;
    return nameChanged || cardsChanged;
});
