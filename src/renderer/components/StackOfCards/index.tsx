import * as classNames from "classnames";
import * as React from "react";

import {
    State,
} from "../../state/types";

const styles = require("./style.css");

interface StackOfCardsProps {
    className?: string;
    children?: React.ReactNode;
    size: number;
}

class StackOfCards extends React.Component<StackOfCardsProps, {}> {
    constructor(props: StackOfCardsProps) {
        super(props);
        this.state = {};
    }

    public render() {
        const {
            children,
            className,
        } = this.props;
        return (
            <div className={classNames(styles.container, className)}>
                <div className={styles.paper}>
                    {children}
                </div>
            </div>
        );
    }
}

export default StackOfCards;
