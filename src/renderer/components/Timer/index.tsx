import * as classNames from "classnames";
import * as React from "react";

import {
    State,
} from "../../state/types";

const styles = require("./style.css");

interface TimerProps {
    className?: string;
    startSeconds: number;
    isStarted?: boolean;
    onComplete?: () => void;
    seconds: number;
    updateSeconds: (seconds: number) => void;
}

class Timer extends React.Component<TimerProps, {}> {
    private timer: any;

    constructor(props: TimerProps) {
        super(props);
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
            <div className={classNames(styles.container, className)}>
                {seconds}
            </div>
        );
    }

    private clearTimer = () => {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

export default Timer;
