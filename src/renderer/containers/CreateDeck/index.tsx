import * as React from "react";
import { connect } from "react-redux";

const styles = require("./style.css");

import { Deck } from "../../state/deck/types";
import { getSelectedDeck } from "../../state/selection/selectors";
import {
    State
} from "../../state/types";

interface DeckProps {
    deck: Deck;
}

interface DeckState {
    id?: number;
    cardFront?: string;
    cardBack?: string;
}

class CreateDeck extends React.Component<DeckProps, DeckState> {
    public state: DeckState = {};

    constructor(props: DeckProps) {
        super(props);
    }

    public render() {
        return (
            <div>
                Deck
            </div>
        );
    }
}

function mapStateToProps(state: State): DeckProps {
    return {
        deck: getSelectedDeck(state) || {
            cards: [],
            name: "",
        },
    };
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(CreateDeck);
