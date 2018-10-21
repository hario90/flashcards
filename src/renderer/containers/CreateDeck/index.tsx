import {
    Button,
    Icon,
    Input,
} from "antd";
import { isEmpty } from "lodash";
import { ChangeEvent } from "react";
import * as React from "react";
import { connect } from "react-redux";

import CardRow from "../../components/CardRow/index";
import { deleteDeck, saveDeck } from "../../state/deck/actions";
import { Card, Deck, SaveDeckAction } from "../../state/deck/types";
import { setPage } from "../../state/page/actions";
import { Page, SetPageAction } from "../../state/page/types";
import { getSelectedDeck } from "../../state/selection/selectors";
import {
    State
} from "../../state/types";

const styles = require("./style.css");

interface DeckProps {
    deck: Deck;
    saveDeck: (deck: Deck) => SaveDeckAction;
    setPage: (page: Page) => SetPageAction;
}

interface DeckState {
    name?: string;
    cards: Card[];
    error?: string;
}

const EMPTY_CARD = {
    back: "",
    front: "",
};

class CreateDeck extends React.Component<DeckProps, DeckState> {
    constructor(props: DeckProps) {
        super(props);
        this.state = {
            cards: isEmpty(props.deck.cards) ? [
                EMPTY_CARD,
                EMPTY_CARD,
                EMPTY_CARD,
                EMPTY_CARD,
                EMPTY_CARD,
            ] : props.deck.cards,
            name: props.deck.name,
        };
        this.goBack = this.goBack.bind(this);
        this.updateDeckName = this.updateDeckName.bind(this);
        this.updateFront = this.updateFront.bind(this);
        this.updateBack = this.updateBack.bind(this);
        this.addCard = this.addCard.bind(this);
        this.save = this.save.bind(this);
    }

    public updateDeckName(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({
            name: event.target.value,
        });
    }

    public goBack(): void {
        this.props.setPage(Page.Home);
    }

    public save(): void {
        const { cards, name } = this.state;
        const completeCards = cards.filter((card: Card) => card.front && card.back);
        let errorMessage = "";
        if (!name) {
            errorMessage = "You deck is missing a name. ";
        }

        if (isEmpty(completeCards)) {
            errorMessage += "Your deck is empty. Please make sure you have completed both sides of each card.";
        }

        if (errorMessage) {
            this.setState({error: errorMessage});
        } else {
            this.setState({error: undefined});
            this.props.saveDeck({
                cards: completeCards,
                id: this.props.deck.id,
                name: this.state.name || "",
            });
            this.props.setPage(Page.Home);
        }
    }

    public updateFront(cardIndex: number, front: string): void {
        const cards = [
                ...this.state.cards,
        ];
        cards[cardIndex] = {
            ...cards[cardIndex],
            front,
        };
        this.setState({cards});
    }

    public updateBack(cardIndex: number, back: string): void {
        const cards = [
            ...this.state.cards,
        ];
        cards[cardIndex] = {
            ...cards[cardIndex],
            back,
        };
        this.setState({cards});
    }

    public addCard(): void {
        const cards = [
            ...this.state.cards,
            EMPTY_CARD,
        ];
        this.setState({cards});
    }

    public render() {
        const { cards, name, error } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.goBack}>
                    <Icon type="left" />Go back
                </Button>
                <h1 className={styles.title}>Create a new study set</h1>
                <Input
                    value={name}
                    placeholder="Deck Name"
                    onChange={this.updateDeckName}
                />
                <div>Title</div>
                {cards.map((card: Card, i: number) => (
                    <CardRow
                        updateFront={this.updateFront}
                        updateBack={this.updateBack}
                        key={i}
                        index={i}
                        card={card}
                    />
                ))}
                {error && <div className={styles.error}>{error}</div>}
                <Button type="default" onClick={this.addCard}>
                    Add Card
                </Button>
                <Button type="primary" onClick={this.save}>
                    Save
                </Button>
            </div>
        );
    }
}

function mapStateToProps(state: State): Partial<DeckProps> {
    return {
        deck: getSelectedDeck(state) || {
            cards: [],
            id: 0,
            name: "",
        },
    };
}

const dispatchToPropsMap = {
    deleteDeck,
    saveDeck,
    setPage,
};

export default connect(mapStateToProps, dispatchToPropsMap)(CreateDeck);
