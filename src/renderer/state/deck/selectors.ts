import { find, isEmpty, uniq } from "lodash";
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

export const getNotEmptyDraftCards = createSelector([
    getDraft,
], (draft?: Deck) => {
    return draft ? draft.cards.filter((card: Card) => card.front || card.back) : [];
});

export const unsavedChanges = createSelector([
    getNotEmptyDraftCards,
    getSelectedDeck,
    getDraft,
], (
    notEmptyDraftCards: Card[],
    selected?: Deck,
    draft?: Deck
): boolean => {
    if (!selected || !draft) {
        return false;
    }

    const nameChanged = selected.name !== draft.name;
    const { cards: draftCards } = draft;
    const { cards: savedCards } = selected;

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

export const getCompleteCards = createSelector([
    getDraft,
], (draft?: Deck) => {
    if (!draft) {
        return [];
    }

    return draft.cards.filter((card: Card) => card.front && card.back);
});

export const getCanSave = createSelector([
    unsavedChanges,
    getCompleteCards,
    getDraft,
], (unsavedChangesExist: boolean, completeCards: Card[], draft?: Deck) => {
    if (!draft) {
        return false;
    }

    return !!draft.name && !isEmpty(completeCards) && unsavedChangesExist;
});

export const getErrorMessage = createSelector([
    getCompleteCards,
    getNotEmptyDraftCards,
    getDraft,
], (completeCards: Card[], notEmptyDraftCards: Card[], draft?: Deck) => {
    if (!draft) {
        return "";
    }

    let errorMessage = "";
    if (!draft.name) {
        errorMessage = "You deck is missing a name.\n";
    }

    if (isEmpty(completeCards)) {
        errorMessage += "Your deck is empty. Please make sure you have completed both sides of each card.\n";
    }

    if (completeCards.length !== notEmptyDraftCards.length) {
        errorMessage += "There are incomplete cards in your deck.\n";
    }

    const fronts = completeCards.map((c) => c.front);
    const frontsAreUnique = uniq(fronts).length === fronts.length;

    if (!frontsAreUnique) {
        errorMessage += "There are duplicate terms in your deck\n";
    }

    return errorMessage;
});
