import * as classNames from "classnames";
import * as React from "react";

const styles = require("./style.pcss");

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
            size,
        } = this.props;
        const style = {
            [styles.empty]: size < 1,
            [styles.two]: size === 2,
            [styles.multiple]: size > 2,
        };
        return (
            <div className={classNames(styles.container, className)}>
                <div className={classNames(styles.deck, style)}>
                    {children}
                </div>
            </div>
        );
    }
}

export default StackOfCards;
