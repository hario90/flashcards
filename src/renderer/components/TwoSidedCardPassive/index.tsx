import { Card as AntdCard } from "antd";
import * as classNames from "classnames";
import * as React from "react";

import { Card } from "../../state/deck/types";

const styles = require("./style.css");

interface TwoSidedCardPassiveProps {
    className?: string;
    currentCard: Card;
    disabled?: boolean;
    height?: number;
    isFlipped: boolean;
    onFlip: (card: Card) => void;
    showTitle?: boolean;
    width?: number;
    frontColor?: string;
    backColor?: string;
    style?: any;
}

class TwoSidedCardPassive extends React.Component<TwoSidedCardPassiveProps, {}> {
    private static defaultProps: Partial<TwoSidedCardPassiveProps> = {
        disabled: false,
        height: 300,
        isFlipped: false,
        showTitle: true,
        width: 320,
    };
    constructor(props: TwoSidedCardPassiveProps) {
        super(props);
        this.state = {
            showFront: props.onFlip ? !props.isFlipped : true,
        };
        this.flipCard = this.flipCard.bind(this);
    }

    public render() {
        const { backColor, className, currentCard, frontColor, height, isFlipped, showTitle, style, width }
            = this.props;
        const hover = {
            [styles.hover]: isFlipped,
        };
        return (
            <div
                className={classNames(styles.flipContainer, hover)}
                style={{...style, width, height}}
                onClick={this.flipCard}
            >
                <div className={styles.flipper} style={{...style, height}}>
                    <AntdCard
                        title={showTitle ? "Term" : null}
                        className={classNames(styles.card, styles.front, className)}
                        style={{width, height, backgroundColor: frontColor || "white"}}
                    >
                        <div className={styles.cardContent}>
                            <p>{currentCard.front}</p>
                        </div>
                    </AntdCard>
                    <AntdCard
                        title={showTitle ? "Definition" : null}
                        className={classNames(styles.card, styles.back, className)}
                        style={{...style, width, height, backgroundColor: backColor || "white"}}
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
        if (!this.props.disabled) {
            this.props.onFlip(this.props.currentCard);
        }
    }
}

export default TwoSidedCardPassive;
