import { Button, Icon } from "antd";
import * as classNames from "classnames";
import { includes, shuffle } from "lodash";
import * as React from "react";
import { connect } from "react-redux";
import { clearInterval } from "timers";

import { getSelectedDeck } from "../../state/deck/selectors";
import { Card, Deck } from "../../state/deck/types";
import {
    State,
} from "../../state/types";

const styles = require("./style.css");
const TOTAL_LIVES = 4;
const CORRECT_ANSWER_REWARD = 4;
const SECONDS_PER_ROUND = 10;

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
    secondsLeft: number;
    isStarted: boolean;
}

class Match extends React.Component<MatchProps, MatchState> {
    private interval: any;
    constructor(props: MatchProps) {
        super(props);
        const cards = shuffle(props.deck.cards);
        this.state = {
            currentCard: cards.pop(),
            guessedOptions: [],
            isStarted: false,
            livesLeft: TOTAL_LIVES,
            points: 0,
            secondsLeft: SECONDS_PER_ROUND,
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
            secondsLeft: SECONDS_PER_ROUND,
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

        const optionsCards = [...unusedCards, currentCard];
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

    public startGame = () => {
        this.setState({isStarted: true});
        if (this.interval) {
            clearInterval(this.interval);
        }

        this.interval = setInterval(() => {
            if (!this.interval) {
                return;
            }

            this.setState((prevState) => {
                let secondsLeft = prevState.secondsLeft - 1;
                let livesLeft = prevState.livesLeft;
                if (secondsLeft < 0 && livesLeft > 0) {
                    secondsLeft = SECONDS_PER_ROUND;
                    livesLeft--;
                }

                if (livesLeft === 0) {
                    secondsLeft = 0;
                    clearInterval(this.interval);
                    this.interval = null;
                }

                return {
                    livesLeft,
                    secondsLeft,
                };
            });
        }, 1000);
    }

    public getLives = () => {
        const { livesLeft } = this.state;

        const result = [];
        for (let i = 0; i < TOTAL_LIVES; i++) {
            const color = i < livesLeft ?  "#db4369" : "#d1d2d3";
            result.push(<Icon className={styles.life} theme="twoTone" type="heart" key={i} twoToneColor={color}/>);
        }

        return result;
    }

    public getBody = () => {
        const {
            currentCard,
            isStarted,
            livesLeft,
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

        if (!isStarted) {
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

    public renderClock = (seconds: number) => {
        const tensMinute = Math.floor(seconds / 600);
        const onesMinute = Math.floor(seconds / 60);
        const tensSecond = Math.floor(seconds % 60 / 10);
        const onesSecond = Math.floor(seconds % 60 % 10);
        return `${tensMinute}${onesMinute}:${tensSecond}${onesSecond}`;
    }

    public render() {
        const { className } = this.props;
        const { points, secondsLeft } = this.state;

        return (
            <div className={classNames(styles.container, className)}>
                <div className={styles.statusRow}>
                    <div className={styles.lives}>
                        {this.getLives()}
                        <div>
                            LIVES LEFT
                        </div>
                    </div>
                    <div className={styles.timeLeft}>
                        {this.renderClock(secondsLeft)}
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
