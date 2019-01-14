import * as classNames from "classnames";
import * as React from "react";

import {
    State,
} from "../../state/types";
import Timer = NodeJS.Timer;

const styles = require("./style.css");

interface TimerProps {
    className?: string;
    isStarted?: boolean;
    onComplete?: () => void;
    seconds: number;
    updateSeconds: (seconds: number) => void;
}

class CountdownTimer extends React.Component<TimerProps, {}> {
    private timer?: Timer;

    constructor(props: TimerProps) {
        super(props);
    }

    public componentWillUnmount() {
        this.clearTimer();
    }

    public componentDidUpdate(prevProps: TimerProps) {
        const startClicked = !prevProps.isStarted && this.props.isStarted;
        const pauseClicked = prevProps.isStarted && !this.props.isStarted;

        if (startClicked && !this.timer) {

            this.timer = setInterval(() => {
                if (this.props.seconds === 0) {
                    this.clearTimer();

                    if (this.props.onComplete) {
                        this.props.onComplete();
                    }

                } else {
                    const seconds = this.props.seconds - 1;
                    this.props.updateSeconds(seconds);
                }

            }, 1000);
        } else if (pauseClicked) {
            this.clearTimer();
        }
    }

    public render() {
        const { className, seconds } = this.props;
        return (
            <div className={classNames(styles.container, className, {[styles.warning]: seconds < 6})}>
                {this.renderClock(seconds)}
            </div>
        );
    }

    private clearTimer = () => {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    private renderClock = (seconds: number) => {
        const tensMinute = Math.floor(seconds / 600);
        const onesMinute = Math.floor(seconds / 60);
        const tensSecond = Math.floor(seconds % 60 / 10);
        const onesSecond = Math.floor(seconds % 60 % 10);
        return `${tensMinute}${onesMinute}:${tensSecond}${onesSecond}`;
    }
}

export default CountdownTimer;
