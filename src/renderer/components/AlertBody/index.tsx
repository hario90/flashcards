import { Button } from "antd";
import * as classNames from "classnames";
import * as React from "react";

const styles = require("./style.css");

interface AlertBodyProps {
    className?: string;
    message: string;
    onYes?: () => void;
    onNo?: () => void;
}

class AlertBody extends React.Component<AlertBodyProps, {}> {
    constructor(props: AlertBodyProps) {
        super(props);
        this.state = {};
    }

    public onNo = () => {
        const { onNo } = this.props;

        if (onNo) {
            onNo();
        }
    }

    public onYes = () => {
        const { onYes } = this.props;

        if (onYes) {
            onYes();
        }
    }

    public render() {
        const {
            className,
            message,
            onNo,
            onYes,
        } = this.props;
        return (
            <div className={classNames(styles.container, className)}>
                {message}
                <div className={styles.buttonContainer}>
                    {onNo && <Button onClick={this.onNo}>No</Button>}
                    {onYes && <Button onClick={this.onYes}>Yes</Button>}
                </div>
            </div>
        );
    }
}

export default AlertBody;
