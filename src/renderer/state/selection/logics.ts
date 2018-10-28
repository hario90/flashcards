import { isEmpty, random } from "lodash";
import { createLogic } from "redux-logic";

import { ReduxLogicDeps, ReduxLogicNextCb } from "../types";
import { batchActions } from "../util";

import { setCurrentCard, setSeenCards, setUnseenCards } from "./actions";
import { GET_NEXT_CARD } from "./constants";
import { getCurrentCard, getSeenCards, getUnseenCards } from "./selectors";
import { LearnStateBranch } from "./types";

export const getRandomCardFromDeck = ({ currentCard, seenCards, unseenCards }: LearnStateBranch):
    LearnStateBranch  => {
    const unseenCardsCopy = [...unseenCards];
    const seenCardsCopy = [...seenCards];

    if (currentCard) {
        seenCardsCopy.push(currentCard);
    }

    let card;
    if (!isEmpty(unseenCardsCopy)) {
        const index = random(unseenCardsCopy.length - 1);
        card = unseenCardsCopy.splice(index, 1)[0];
    }

    return {
        currentCard: card,
        seenCards: seenCardsCopy,
        unseenCards: unseenCardsCopy,
    };
};

const getNextCardLogic = createLogic({
    transform: ({getState, action}: ReduxLogicDeps, next: ReduxLogicNextCb) => {
        const {currentCard, seenCards, unseenCards} = getRandomCardFromDeck({
            currentCard: getCurrentCard(getState()),
            seenCards: getSeenCards(getState()),
            unseenCards: getUnseenCards(getState()),
        });

        const actions = [
            setCurrentCard(currentCard),
            setSeenCards(seenCards),
            setUnseenCards(unseenCards),
        ];

        next(batchActions(actions));
    },
    type: GET_NEXT_CARD,
});

export default [
    getNextCardLogic,
];
