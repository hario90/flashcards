import { Card as AntdCard } from "antd";
import * as classNames from "classnames";
import * as React from "react";

import { Card } from "../../state/deck/types";

const styles = require("./style.css");

interface TwoSidedCardProps {
    className?: string;
    currentCard: Card;
}

interface TwoSidedCardState {
    showFront: boolean;
}

class TwoSidedCard extends React.Component<TwoSidedCardProps, TwoSidedCardState> {
    constructor(props: TwoSidedCardProps) {
        super(props);
        this.state = {
            showFront: true,
        };
        this.flipCard = this.flipCard.bind(this);
    }

    public render() {
        const { className, currentCard } = this.props;
        const { showFront } = this.state;
        const hover = {
            [styles.hover]: !showFront,
        };
        return (
            <div
                className={classNames(styles.flipContainer, hover, className)}
                onClick={this.flipCard}
            >
                <div className={styles.flipper}>
                    <AntdCard
                        title="Term"
                        className={classNames(styles.card, styles.front)}
                    >
                        <p>{currentCard.front}</p>
                    </AntdCard>
                    <AntdCard
                        title="Definition"
                        className={classNames(styles.card, styles.back)}
                    >
                        <p>{currentCard.back}</p>
                    </AntdCard>
                </div>
            </div>
        );
    }

    public flipCard(): void {
        this.setState({showFront: !this.state.showFront});
    }
}

export default TwoSidedCard;
