import { Icon } from "antd";
import * as classNames from "classnames";
import * as React from "react";

import { Card } from "../../state/deck/types";
import CountdownTimer from "../Timer/index";

const styles = require("./style.pcss");

interface MatchBannerProps {
    className?: string;
    isStarted: boolean;
    livesLeft: number;
    onTimerComplete: () => void;
    points: number;
    seconds: number;
    maxLives: number;
    unusedCards: Card[];
    updateSeconds: (seconds: number) => void;
}

class MatchBanner extends React.Component<MatchBannerProps, {}> {
    constructor(props: MatchBannerProps) {
        super(props);
        this.state = {};
    }

    public render() {
        const {
            className,
            isStarted,
            onTimerComplete,
            points,
            seconds,
            unusedCards,
            updateSeconds,
        } = this.props;
        return (
            <div className={classNames(styles.container, className)}>
                <div className={styles.lives}>
                    {this.getLives()}
                    <div>
                        LIVES LEFT
                    </div>
                </div>
                <CountdownTimer
                    className={styles.timeLeft}
                    onComplete={onTimerComplete}
                    seconds={seconds}
                    updateSeconds={updateSeconds}
                    isStarted={isStarted}
                />
                <div className={styles.cardsLeftContainer}>
                    <div className={styles.cardsLeft}>{unusedCards.length}</div>
                    <div>REMAINING</div>
                </div>
                <div className={styles.pointsContainer}>
                    <div className={styles.points}>{points}</div>
                    <div>POINTS</div>
                </div>
            </div>
        );
    }

    private getLives = () => {
        const { livesLeft, maxLives } = this.props;

        const result = [];
        for (let i = 0; i < maxLives; i++) {
            const color = i < livesLeft ?  "#db4369" : "#d1d2d3";
            result.push(<Icon className={styles.life} theme="twoTone" type="heart" key={i} twoToneColor={color}/>);
        }

        return result;
    }
}

export default MatchBanner;
