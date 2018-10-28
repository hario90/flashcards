import {
    Alert,
    Button,
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
import { selectDeck } from "../../state/selection/actions";
import { getSelectedDeck } from "../../state/selection/selectors";
import { SelectDeckAction } from "../../state/selection/types";
import {
    State
} from "../../state/types";

const styles = require("./style.css");

interface DeckProps {
    deck: Deck;
    saveDeck: (deck: Deck) => SaveDeckAction;
    selectDeck: (deckId: number | number[]) => SelectDeckAction;
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
        this.goToLearn = this.goToLearn.bind(this);
        this.goToTest = this.goToTest.bind(this);
        this.onSavePressed = this.onSavePressed.bind(this);
        this.getCurrentDeck = this.getCurrentDeck.bind(this);
    }

    public updateDeckName(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({
            name: event.target.value,
        });
    }

    public goBack(): void {
        this.props.setPage(Page.Home);
    }

    public onSavePressed(): void {
        this.save(Page.Home);
    }

    public save(nextPage?: Page): void {
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
            this.props.saveDeck(this.getCurrentDeck());
            this.props.setPage(nextPage || Page.Home);
        }
    }

    public getCurrentDeck(): Deck {
        const completeCards = this.state.cards.filter((card: Card) => card.front && card.back);
        return {
            cards: completeCards,
            id: this.props.deck.id,
            name: this.state.name || "",
        };
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

    public goToLearn(): void {
        this.props.selectDeck(this.props.deck.id);
        this.save(Page.Learn);
    }

    public goToTest(): void {
        this.props.selectDeck(this.props.deck.id);
        this.save(Page.Test);
    }

    public render() {
        const { cards, name, error } = this.state;
        return (
            <div>
                <div className={styles.titleRow}>
                    <h1 className={styles.title}>Create a new study set</h1>
                    <div className={styles.actionButtons}>
                        <Button onClick={this.goToLearn}>Learn</Button>
                        <Button onClick={this.goToTest}>Test</Button>
                    </div>
                </div>
                <Input
                    value={name}
                    placeholder="Deck Name"
                    onChange={this.updateDeckName}
                />
                <div>Title</div>
                {error && <Alert
                    message="Could Not Save Deck"
                    description={error}
                    type="error"
                    showIcon={true}
                />}
                {cards.map((card: Card, i: number) => (
                    <CardRow
                        updateFront={this.updateFront}
                        updateBack={this.updateBack}
                        key={i}
                        index={i}
                        card={card}
                    />
                ))}
                <Button type="default" onClick={this.addCard}>
                    Add Card
                </Button>
                <Button type="primary" onClick={this.onSavePressed}>
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
    selectDeck,
    setPage,
};

export default connect(mapStateToProps, dispatchToPropsMap)(CreateDeck);
