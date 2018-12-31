import { Button } from "antd";
import * as classNames from "classnames";
import { includes, shuffle } from "lodash";
import * as React from "react";
import { connect } from "react-redux";

import { getSelectedDeck } from "../../state/deck/selectors";
import { Card, Deck } from "../../state/deck/types";
import {
    State,
} from "../../state/types";

const styles = require("./style.css");

interface MatchProps {
    className?: string;
    deck: Deck;
}

interface MatchState {
    useTerm: boolean;
    currentCard?: Card;
    usedCards: Card[];
    unusedCards: Card[];
    guessedOptions: string[];
}

class Match extends React.Component<MatchProps, MatchState> {
    constructor(props: MatchProps) {
        super(props);
        const cards = shuffle(props.deck.cards);
        this.state = {
            currentCard: cards.pop(),
            guessedOptions: [],
            unusedCards: cards,
            useTerm: false,
            usedCards: [],
        };
    }

    public getNextCard = () => {
        const { unusedCards } = this.state;
        const cards = [...unusedCards];
        this.setState({
            currentCard: cards.pop(),
            unusedCards: cards,
        });
    }

    public eliminateOption = (option: string) => {
        const { guessedOptions } = this.state;
        const guessedOptionsCopy = [...guessedOptions];
        guessedOptionsCopy.push(option);
        this.setState({
            guessedOptions: guessedOptionsCopy,
        });
    }

    public selectOption = (option: string) => () => {
        const { useTerm, currentCard } = this.state;
        if (!currentCard) {
            return;
        }

        const answer = useTerm ? currentCard.back : currentCard.front;
        if (option === answer) {
            this.getNextCard();
        } else {
            this.eliminateOption(option);
        }
    }

    public getOptions = () => {
        const {
            currentCard,
            guessedOptions,
            useTerm,
            unusedCards,
        } = this.state;

        if (!currentCard) {
            return;
        }

        const optionsCards = shuffle([...unusedCards, currentCard]);
        const options: string[] = optionsCards.map((c) => useTerm ? c.back : c.front);
        return options.map((o) => (
            <Button
                key={o}
                className={styles.button}
                onClick={this.selectOption(o)}
                disabled={includes(guessedOptions, o)}
            >
                {o}
            </Button>
        ));
    }

    public render() {
        const { className } = this.props;
        const {
            currentCard,
            useTerm,
        } = this.state;
        if (!currentCard) {
            return (
                <div className={classNames(styles.container, className)}>
                    No more cards
                </div>
            );
        }
        return (
            <div className={classNames(styles.container, className)}>
                <div className={styles.prompt}>
                    {useTerm ? currentCard.front : currentCard.back}
                </div>
                <div className={styles.options}>
                    {this.getOptions()}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        deck: getSelectedDeck(state),
    };
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(Match);
