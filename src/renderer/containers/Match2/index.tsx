import { Button, Icon } from "antd";
import * as classNames from "classnames";
import { includes, isEmpty, shuffle } from "lodash";
import * as React from "react";
import { connect } from "react-redux";

import CountdownTimer from "../../components/Timer/index";
import { getSelectedDeck } from "../../state/deck/selectors";
import { Card, Deck } from "../../state/deck/types";
import {
    State,
} from "../../state/types";

const styles = require("./style.css");
const TOTAL_LIVES = 4;
const CORRECT_ANSWER_REWARD = 4;
const SECONDS_PER_ROUND = 10;
const TRANSITION_SECONDS = 3;

interface Match2Props {
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
    transition?: "SUCCESS" | "ERROR";
    optionPicked?: string;
}

class Match2 extends React.Component<Match2Props, MatchState> {
    private timer?: any;

    constructor(props: Match2Props) {
        super(props);
        const cards = shuffle(props.deck.cards);
        this.state = {
            currentCard: cards.pop(),
            guessedOptions: [],
            isStarted: false,
            livesLeft: TOTAL_LIVES,
            points: 0,
            seconds: SECONDS_PER_ROUND,
            unusedCards: cards,
            useTerm: false,
            usedCards: [],
        };
    }

    public  componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
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
                        startSeconds={10}
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
            optionPicked,
            livesLeft,
            transition,
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

        if (!isStarted && isEmpty(usedCards) && !transition) {
            return (
                <div className={styles.body}>
                    <Button onClick={this.startGame} type="primary" size="large">Start Game</Button>
                </div>
            );
        }

        if (livesLeft <= 0) {
            return (
                <div className={styles.body}>
                    You Lose!
                </div>
            );
        }

        if (transition) {
            const isCorrect = transition === "SUCCESS";
            const result =  isCorrect ? "Correct!" : "Wrong!";

            return (
                <div className={classNames(styles.body, styles.transition)}>
                    <span className={styles.result}>{result}</span>
                    <span className={classNames(styles.youChose)}>
                        YOU CHOSE:&nbsp;
                        <span className={classNames({[styles.wrongAnswer]: !isCorrect})}>
                            {optionPicked}
                        </span>
                    </span>
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

    private removeTransition = () => {
        this.setState({
                isStarted: true,
                optionPicked: undefined,
                seconds: SECONDS_PER_ROUND,
                transition: undefined,
            });
    }

    private showTransition = (isCorrect: boolean, option?: string) => {
        option = option || "NO ANSWER";

        if (this.timer) {
            clearTimeout(this.timer);
        }

        if (isCorrect && this.state.currentCard) {
            const usedCards = [...this.state.usedCards];
            usedCards.push(this.state.currentCard);
            this.setState((prevState) => {
                const { points, unusedCards } = this.state;
                const cards = [...unusedCards];
                const currentCard = cards.pop();

                return {
                    currentCard,
                    guessedOptions: [],
                    isStarted: false,
                    optionPicked: option,
                    points: !isEmpty(unusedCards) ? points + CORRECT_ANSWER_REWARD : points,
                    transition: "SUCCESS",
                    unusedCards: cards,
                    usedCards,
                };
            });

            this.timer = setTimeout(this.removeTransition, TRANSITION_SECONDS * 1000);
        } else {
            const { guessedOptions, livesLeft } = this.state;
            const guessedOptionsCopy = [...guessedOptions];
            if (option) {
                guessedOptionsCopy.push(option);
            }

            this.setState({
                guessedOptions: guessedOptionsCopy,
                isStarted: false,
                livesLeft: livesLeft - 1,
                optionPicked: option,
                transition: "ERROR",
            });

            this.timer = setTimeout(this.removeTransition, TRANSITION_SECONDS * 1000);
        }
    }

    private selectOption = (option: string) => () => {
        const { useTerm, currentCard } = this.state;
        if (!currentCard) {
            return;
        }

        const answer = useTerm ? currentCard.back : currentCard.front;
        this.showTransition(option === answer, option);
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

    private startGame = () => {
        this.setState({isStarted: true});
    }

    private onTimerComplete = () => {
        this.showTransition(false, undefined);
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

export default connect(mapStateToProps, dispatchToPropsMap)(Match2);
