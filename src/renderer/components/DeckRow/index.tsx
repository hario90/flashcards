import * as React from "react";

import { Deck } from "../../state/deck/types";

const styles = require("./styles.css");

interface DeckRowProps {
    deck: Deck;
    selectDeck: (deckId: number | number[]) => void;
}
class DeckRow extends React.Component<DeckRowProps, {}> {
    constructor(props: DeckRowProps) {
        super(props);
        this.selectDeck = this.selectDeck.bind(this);
    }

    public selectDeck(): void {
        this.props.selectDeck(this.props.deck.id);
    }

    public render() {
        const { deck } = this.props;
        const cardsLabel = deck.cards.length > 1 ? "cards" : "card";
        return (
            <div className={styles.container} onClick={this.selectDeck}>
                <div className={styles.name}>{deck.name}</div>
                <div className={styles.numberCards}>{deck.cards.length} {cardsLabel}</div>
            </div>
        );
    }
}

export default DeckRow;
