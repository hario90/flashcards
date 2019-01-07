import { Button, Icon } from "antd";
import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import Timer from "../../components/Timer/index";
import { getSelectedDeck } from "../../state/deck/selectors";
import { Deck } from "../../state/deck/types";
import {
    State,
} from "../../state/types";

const styles = require("./style.css");
const TOTAL_LIVES = 4;
const CORRECT_ANSWER_REWARD = 4;
const SECONDS_PER_ROUND = 10;

interface Match2Props {
    className?: string;
    deck: Deck;
}

interface MatchState {
    isStarted: boolean;
    livesLeft: number;
    seconds: number;
}

class Match2 extends React.Component<Match2Props, MatchState> {
    constructor(props: Match2Props) {
        super(props);
        this.state = {
            isStarted: false,
            livesLeft: TOTAL_LIVES,
            seconds: SECONDS_PER_ROUND,
        };
    }

    public render() {
        const { className } = this.props;
        const {isStarted, seconds } = this.state;
        return (
            <div className={classNames(styles.container, className)}>
                <div className={styles.statusRow}>
                    <div className={styles.lives}>
                        {this.getLives()}
                        <div>
                            LIVES LEFT
                        </div>
                    </div>
                    <Timer
                        className={styles.timeLeft}
                        onComplete={this.onTimerComplete}
                        startSeconds={10}
                        seconds={seconds}
                        updateSeconds={this.updateSeconds}
                        isStarted={isStarted}
                    />
                    <div className={styles.pointsContainer}>
                        <div className={styles.points}>4</div>
                        <div>POINTS</div>
                    </div>
                </div>

                <Button onClick={this.startGame}>Start Game</Button>
                <Button onClick={this.pauseGame}>Pause</Button>
                <Button onClick={this.resetGame}>Reset</Button>
            </div>
        );
    }

    private startGame = () => {
        this.setState({isStarted: true});
    }

    private pauseGame = () => {
        this.setState({isStarted: false});
    }

    private resetGame = () => {
        this.setState({seconds: SECONDS_PER_ROUND});
    }

    private onTimerComplete = () => {
        console.log("timer complete");
        this.setState({isStarted: false});
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
