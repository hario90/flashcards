import * as classNames from "classnames";
import * as React from "react";

const styles = require("./style.pcss");

interface AlertBodyProps {
    className?: string;
    message: string;
}

class AlertBody extends React.Component<AlertBodyProps, {}> {
    constructor(props: AlertBodyProps) {
        super(props);
        this.state = {};
    }

    public render() {
        const {
            className,
            message,
        } = this.props;
        return (
            <div className={classNames(styles.container, className)}>
                {message}
            </div>
        );
    }
}

export default AlertBody;
