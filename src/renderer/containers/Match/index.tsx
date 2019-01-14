import { Button, Icon } from "antd";
import * as classNames from "classnames";
import { includes, isEmpty, shuffle } from "lodash";
import * as React from "react";
import { connect } from "react-redux";

import CountdownTimer from "../../components/Timer";
import { getSelectedDeck } from "../../state/deck/selectors";
import { Card, Deck } from "../../state/deck/types";
import {
    State,
} from "../../state/types";

const styles = require("./style.css");
const TOTAL_LIVES = 4;
const CORRECT_ANSWER_REWARD = 4;
const SECONDS_PER_WORD = 5;

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
    points: number;
}

class Match extends React.Component<MatchProps, MatchState> {
    constructor(props: MatchProps) {
        super(props);
        this.state = this.getStartState();
    }

    public render() {
        const { className } = this.props;
        const {isStarted, points, seconds } = this.state;
        return (
            <div className={classNames(styles.container, className)}>
                <div className={styles.statusRow}>
                    <div className={styles.lives}>
                        {this.getLives()}
                        <div>
                            LIVES LEFT
                        </div>
                    </div>
                    <CountdownTimer
                        className={styles.timeLeft}
                        onComplete={this.onTimerComplete}
                        seconds={seconds}
                        updateSeconds={this.updateSeconds}
                        isStarted={isStarted}
                    />
                    <div className={styles.pointsContainer}>
                        <div className={styles.points}>{points}</div>
                        <div>POINTS</div>
                    </div>
                </div>
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

        console.log(this.state);
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

    private getNextCard = () => {
        const usedCards = [...this.state.usedCards];

        if (this.state.currentCard) {
            usedCards.push(this.state.currentCard);
        }

        this.setState((prevState) => {
            const { points, unusedCards } = prevState;
            const cards = [...unusedCards];
            const currentCard = cards.pop();

            return {
                currentCard,
                guessedOptions: [],
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

    private getOptions = () => {
        const {
            currentCard,
            guessedOptions,
            useTerm,
            unusedCards,
        } = this.state;

        if (!currentCard) {
            return;
        }

        const optionsCards = [...unusedCards, currentCard];
        const options: string[] = optionsCards.map((c) => useTerm ? c.back : c.front);
        return options.map((o) => (
            <Button
                key={o}
                className={styles.button}
                onClick={this.selectOption(o)}
                disabled={includes(guessedOptions, o)}
                type="primary"
                ghost={true}
                size="large"
            >
                {o}
            </Button>
        ));
    }

    private getStartState = () => {
        const cards = shuffle(this.props.deck.cards);
        return {
            currentCard: cards.pop(),
            guessedOptions: [],
            isStarted: false,
            livesLeft: TOTAL_LIVES,
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
        this.handleWrongAnswer(undefined);
    }

    private updateSeconds = (seconds: number) => {
        this.setState({seconds});
    }

    private getLives = () => {
        const { livesLeft } = this.state;

        const result = [];
        for (let i = 0; i < TOTAL_LIVES; i++) {
            const color = i < livesLeft ?  "#db4369" : "#d1d2d3";
            result.push(<Icon className={styles.life} theme="twoTone" type="heart" key={i} twoToneColor={color}/>);
        }

        return result;
    }
}

function mapStateToProps(state: State) {
    return {
        deck: getSelectedDeck(state),
    };
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(Match);
