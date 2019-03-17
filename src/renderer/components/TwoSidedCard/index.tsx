import { Card as AntdCard } from "antd";
import * as classNames from "classnames";
import * as React from "react";

import { Card } from "../../state/deck/types";

const styles = require("./style.pcss");

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

    public componentDidUpdate(prevProps: TwoSidedCardProps) {
        if (prevProps.currentCard !== this.props.currentCard) {
            this.setState({showFront: true});
        }
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
                        <div className={styles.cardContent}>
                            <p>{currentCard.front}</p>
                        </div>
                    </AntdCard>
                    <AntdCard
                        title="Definition"
                        className={classNames(styles.card, styles.back)}
                    >
                        <div className={styles.cardContent}>
                            {currentCard.back}
                        </div>
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
