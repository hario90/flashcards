import * as classNames from "classnames";
import { Button } from "antd";
import * as React from "react";

import { Deck, DeleteDeckAction } from "../../state/deck/types";

const styles = require("./styles.css");

interface DeckRowProps {
    deck: Deck;
    selectDeck: (deckId: number | number[]) => void;
    deleteDeck: (deckId: number) => void;
    toBeDeleted: boolean;
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
        const { deck, toBeDeleted } = this.props;
        const cardsLabel = deck.cards.length !== 1 ? "cards" : "card";
        const containerStyle = {
            [styles.toBeDeleted]: toBeDeleted,
        };
        return (
            <div className={classNames(styles.container, containerStyle)} onClick={this.selectDeck}>
                <div className={styles.name}>{deck.name}</div>
                <div className={styles.numberCards}>{deck.cards.length}&nbsp;{cardsLabel}</div>
                <Button className={styles.delete} shape="circle" icon="delete" onClick={this.deleteDeck}/>
            </div>
        );
    }
}

export default DeckRow;
