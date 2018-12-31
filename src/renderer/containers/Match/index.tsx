import { Button, Icon } from "antd";
import * as classNames from "classnames";
import { includes, isEmpty, shuffle } from "lodash";
import * as React from "react";
import { connect } from "react-redux";

import { getSelectedDeck } from "../../state/deck/selectors";
import { Card, Deck } from "../../state/deck/types";
import {
    State,
} from "../../state/types";

const styles = require("./style.css");
const TOTAL_LIVES = 4;
const CORRECT_ANSWER_REWARD = 4;

interface MatchProps {
    className?: string;
    deck: Deck;
}

interface MatchState {
    livesLeft: number;
    useTerm: boolean;
    currentCard?: Card;
    usedCards: Card[];
    unusedCards: Card[];
    guessedOptions: string[];
    points: number;
}

class Match extends React.Component<MatchProps, MatchState> {
    constructor(props: MatchProps) {
        super(props);
        const cards = shuffle(props.deck.cards);
        this.state = {
            currentCard: cards.pop(),
            guessedOptions: [],
            livesLeft: TOTAL_LIVES,
            points: 0,
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
            guessedOptions: [],
            points: this.state.points + CORRECT_ANSWER_REWARD,
            unusedCards: cards,
        });
    }

    public eliminateOption = (option: string) => {

        this.setState( (prevState) => {
            const { guessedOptions, livesLeft } = prevState;
            const guessedOptionsCopy = [...guessedOptions];
            guessedOptionsCopy.push(option);

            return {
                guessedOptions: guessedOptionsCopy,
                livesLeft: livesLeft - 1,
            };
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

    public getLives = () => {
        const { livesLeft } = this.state;
        if (livesLeft < 1) {
            return null;
        }

        const result = [];
        for (let i = 0; i < livesLeft; i++) {
            result.push(<Icon className={styles.life} theme="twoTone" type="heart" key={i} twoToneColor="#db4369"/>);
        }

        return result;
    }

    public getBody = () => {
        const {
            currentCard,
            useTerm,
        } = this.state;

        if (!currentCard) {
            return (
                <div>
                    No more cards
                </div>
            );
        }

        return (
            <React.Fragment>
                <div className={styles.prompt}>
                    {useTerm ? currentCard.front : currentCard.back}
                </div>
                <div className={styles.options}>
                    {this.getOptions()}
                </div>
            </React.Fragment>
        );
    }

    public render() {
        const { className } = this.props;
        const { points } = this.state;

        return (
            <div className={classNames(styles.container, className)}>
                <div className={styles.statusRow}>
                    <div className={styles.lives}>
                        {this.getLives()}
                        <div className={styles.livesLeftLabel}>
                            LIVES LEFT
                        </div>
                    </div>
                    <div className={styles.pointsContainer}>
                        <div className={styles.points}>{points}</div>
                        <div>POINTS</div>
                    </div>
                </div>
                {this.getBody()}
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
