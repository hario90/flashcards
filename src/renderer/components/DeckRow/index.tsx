import { Button, Icon } from "antd";
import * as React from "react";

import { Deck, DeleteDeckAction } from "../../state/deck/types";

const styles = require("./styles.css");

interface DeckRowProps {
    deck: Deck;
    selectDeck: (deckId: number | number[]) => void;
    deleteDeck: (deckId: number) => DeleteDeckAction;
}
class DeckRow extends React.Component<DeckRowProps, {}> {
    constructor(props: DeckRowProps) {
        super(props);
        this.selectDeck = this.selectDeck.bind(this);
        this.deleteDeck = this.deleteDeck.bind(this);
    }

    public selectDeck(): void {
        this.props.selectDeck(this.props.deck.id);
    }

    public deleteDeck(e: React.MouseEvent<HTMLButtonElement>): void {
        e.stopPropagation();
        this.props.deleteDeck(this.props.deck.id);
    }

    public render() {
        const { deck } = this.props;
        const cardsLabel = deck.cards.length !== 1 ? "cards" : "card";
        return (
            <div className={styles.container} onClick={this.selectDeck}>
                <div className={styles.name}>{deck.name}</div>
                <div className={styles.numberCards}>{deck.cards.length}&nbsp;{cardsLabel}</div>
                <Button className={styles.delete} shape="circle" icon="delete" onClick={this.deleteDeck}/>
            </div>
        );
    }
}

export default DeckRow;
