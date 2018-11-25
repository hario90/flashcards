import {
    Alert,
    Button,
    Icon,
    Input,
} from "antd";
import * as classNames from "classnames";
import { isEmpty } from "lodash";
import { ChangeEvent } from "react";
import * as React from "react";
import { connect } from "react-redux";

import CardRow from "../../components/CardRow/index";
import LineInput from "../../components/LineInput/index";
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
    className?: string;
    deck: Deck;
    saveDeck: (deck: Deck) => SaveDeckAction;
    selectDeck: (deckId: number | number[]) => SelectDeckAction;
    setPage: (page: Page) => SetPageAction;
}

interface DeckState {
    name?: string;
    cards: Card[];
    error?: string;
    currentlyEditing?: string;
}

const EMPTY_CARD = {
    back: "",
    front: "",
};

class CreateDeck extends React.Component<DeckProps, DeckState> {
    private readonly editing: boolean = false;
    private nameInput?: Input;

    constructor(props: DeckProps) {
        super(props);
        this.editing = !isEmpty(props.deck.cards);
        this.state = {
            cards: !this.editing ? [
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
        this.deleteCard = this.deleteCard.bind(this);
        this.setCurrentlyEditing = this.setCurrentlyEditing.bind(this);
    }

    public setCurrentlyEditing(value?: string): () => void  {
        return () => {
            // todo more elegant way to do this
            if (value === "title" && this.nameInput) {
                this.nameInput.focus();
            }
            this.setState({currentlyEditing: value});
        };
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
            this.setState({error: errorMessage, currentlyEditing: undefined});
        } else {
            this.setState({error: undefined, currentlyEditing: undefined});
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
        this.save(Page.Flip);
    }

    public goToTest(): void {
        this.props.selectDeck(this.props.deck.id);
        this.save(Page.Test);
    }

    public deleteCard(cardIndex: number): void {
        if (this.props.deck && cardIndex > -1 && cardIndex < this.state.cards.length) {
            this.setState((state) => {
                const cards = [...state.cards];
                cards.splice(cardIndex, 1);
                return {
                    cards,
                };
            });
        }
    }

    public componentDidMount(): void {
        if (this.nameInput) {
            this.nameInput.focus();
        }
    }

    public render() {
        const { className } = this.props;
        const { cards, currentlyEditing, name, error } = this.state;
        return (
            <div className={classNames(className)}>
                <div className={styles.titleRow}>
                    {currentlyEditing === "title" ? (
                        <LineInput
                            className={styles.titleInput}
                            value={name}
                            label="title"
                            placeholder="Deck Name"
                            onChange={this.updateDeckName}
                            ref={(input) => { this.nameInput = input ? input.input : undefined; }}
                            onBlur={this.setCurrentlyEditing(undefined)}
                        />
                    ) : (
                        <div className={styles.titleContainer}>
                            <h1>{name}</h1>
                            <Icon
                                className={styles.editIcon}
                                type="edit"
                                onClick={this.setCurrentlyEditing("title")}
                            />
                        </div>
                    )}
                    <Button className={styles.saveButton} type="primary" onClick={this.onSavePressed}>
                        Save
                    </Button>
                </div>
                <div className={styles.cards}>
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
                            deleteCard={this.deleteCard}
                            key={i}
                            index={i}
                            card={card}
                        />
                    ))}
                    <div className={styles.addCard} onClick={this.addCard}>
                        <Icon type="plus" className={styles.plus}/>Add Card
                    </div>
                    <Button type="primary" onClick={this.onSavePressed}>
                        Save
                    </Button>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: State) {
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
