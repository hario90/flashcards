import { Button } from "antd";
import * as classNames from "classnames";
import { includes, isEmpty, shuffle } from "lodash";
import * as React from "react";
import { connect } from "react-redux";

import MatchBanner from "../../components/MatchBanner";
import { getSelectedDeck } from "../../state/deck/selectors";
import { Card, Deck } from "../../state/deck/types";
import {
    State,
} from "../../state/types";

const styles = require("./style.css");

const CORRECT_ANSWER_REWARD = 4;
const SECONDS_PER_WORD = 5;
const MAX_NUMBER_OPTIONS = 6;
const TOTAL_LIVES = 4;

interface MatchProps {
    className?: string;
    deck: Deck;
}

interface MatchState {
    isStarted: boolean;
    livesLeft: number;
    seconds: number;
    useTerm: boolean;
    currentCard?: Card;
    usedCards: Card[];
    unusedCards: Card[];
    guessedOptions: string[];
    options: Card[];
    points: number;
}

class Match extends React.Component<MatchProps, MatchState> {
    constructor(props: MatchProps) {
        super(props);
        this.state = this.getStartState();
    }

    public render() {
        const { className } = this.props;
        const {isStarted, livesLeft, points, seconds, unusedCards } = this.state;
        return (
            <div className={classNames(styles.container, className)}>
                <MatchBanner
                    className={styles.statusRow}
                    isStarted={isStarted}
                    livesLeft={livesLeft}
                    maxLives={TOTAL_LIVES}
                    onTimerComplete={this.onTimerComplete}
                    points={points}
                    seconds={seconds}
                    unusedCards={unusedCards}
                    updateSeconds={this.updateSeconds}
                />
                {this.getBody()}
            </div>
        );
    }

    private getBody = () => {
        const {
            currentCard,
            isStarted,
            livesLeft,
            seconds,
            usedCards,
            useTerm,
        } = this.state;

        if (!currentCard) {
            // todo replace
            return (
                <div className={styles.body}>
                    Good Job!
                </div>
            );
        }

        if (!isStarted && isEmpty(usedCards) && livesLeft > 0) {
            return (
                <div className={styles.body}>
                    <Button onClick={this.startGame} type="primary" size="large">Start Game</Button>
                </div>
            );
        }

        if (livesLeft <= 0 || seconds <= 0) {
            return (
                <div className={classNames(styles.body, styles.youLose)}>
                    <div>You Lose!</div>
                    <Button type="primary" size="large" onClick={this.restartGame}>Start Over</Button>
                </div>
            );
        }

        return (
            <React.Fragment>
                <div className={styles.prompt}>
                    {useTerm ? currentCard.front : currentCard.back}
                </div>
                <div className={styles.options}>
                    {this.renderOptions()}
                </div>
            </React.Fragment>
        );
    }

    private getNextCard = () => {
        const usedCards = [...this.state.usedCards];

        if (this.state.currentCard) {
            usedCards.push(this.state.currentCard);
        }

        this.setState((prevState) => {
            const { points, unusedCards } = prevState;
            const cards = shuffle([...unusedCards]);
            const currentCard = cards.pop();

            return {
                currentCard,
                guessedOptions: [],
                isStarted: !!currentCard,
                options: this.getOptions(cards, currentCard),
                points: !isEmpty(unusedCards) ? points + CORRECT_ANSWER_REWARD : points,
                unusedCards: cards,
                usedCards,
            };
        });
    }

    private handleWrongAnswer = (option?: string) => {
        const { guessedOptions, livesLeft } = this.state;
        const guessedOptionsCopy = [...guessedOptions];
        if (option) {
            guessedOptionsCopy.push(option);
        }

        const isStarted = livesLeft - 1 > 0;

        this.setState({
            guessedOptions: guessedOptionsCopy,
            isStarted,
            livesLeft: livesLeft - 1,
        });
    }

    private selectOption = (option: string) => () => {
        const { useTerm, currentCard } = this.state;
        if (!currentCard) {
            return;
        }

        const answer = useTerm ? currentCard.back : currentCard.front;
        const isCorrect = option === answer;
        if (isCorrect && this.state.currentCard) {
            this.getNextCard();
        } else {
            this.handleWrongAnswer(option);
        }
    }

    private getOptions = (unusedCards: Card[], currentCard?: Card): Card[] => {
        if (!currentCard) {
            return [];
        }

        const shuffledUnusedCards = shuffle([...unusedCards]);
        const optionCards: Card[] = [];
        while (!isEmpty(shuffledUnusedCards) && optionCards.length < MAX_NUMBER_OPTIONS - 1) {
            const card = shuffledUnusedCards.pop();
            if (card) {
                optionCards.push(card);
            }
        }
        optionCards.push(currentCard);
        return shuffle(optionCards);
    }

    private renderOptions = () => {
        const {
            guessedOptions,
            options: optionCards,
            useTerm,
        } = this.state;

        const options: string[] = optionCards.map((c) => useTerm ? c.back : c.front);
        return options.map((o, i) => (
            <Button
                key={o}
                className={styles.button}
                onClick={this.selectOption(o)}
                disabled={includes(guessedOptions, o)}
                type="primary"
                ghost={true}
                size="large"
            >
                {String.fromCharCode(97 + i).toUpperCase()})&nbsp;{o}
            </Button>
        ));
    }

    private getStartState = () => {
        const cards = shuffle(this.props.deck.cards);
        const currentCard = cards.pop();
        return {
            currentCard,
            guessedOptions: [],
            isStarted: false,
            livesLeft: TOTAL_LIVES,
            options: this.getOptions(cards, currentCard),
            points: 0,
            seconds: SECONDS_PER_WORD * cards.length,
            unusedCards: cards,
            useTerm: false,
            usedCards: [],
        };
    }

    private startGame = () => {
        this.setState({isStarted: true});
    }

    private restartGame = () => {
        this.setState({
            ...this.getStartState(),
            isStarted: true,
        });
    }

    private onTimerComplete = () => {
        this.setState({isStarted: false, livesLeft: 0});
    }

    private updateSeconds = (seconds: number) => {
        this.setState({seconds});
    }


}

function mapStateToProps(state: State) {
    return {
        deck: getSelectedDeck(state),
    };
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(Match);
