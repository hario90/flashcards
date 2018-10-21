import { Input } from "antd";
import { ChangeEvent } from "react";
import * as React from "react";

import { Card } from "../../state/deck/types";

const styles = require("./styles.css");

interface CardRowProps {
    card: Card;
    index: number;
    updateFront: (i: number, value: string) => void;
    updateBack: (i: number, value: string) => void; // todo return type
}

class CardRow extends React.Component<CardRowProps, {}>  {
    constructor(props: CardRowProps) {
        super(props);
        this.updateFront = this.updateFront.bind(this);
        this.updateBack = this.updateBack.bind(this);
    }

    public updateFront(event: ChangeEvent<HTMLInputElement>): void {
        const {
            index,
            updateFront,
        } = this.props;
        updateFront(index, event.target.value);
    }

    public updateBack(event: ChangeEvent<HTMLInputElement>): void {
        const {
            index,
            updateBack,
        } = this.props;
        updateBack(index, event.target.value);
    }

    public render() {
        const { card, index } = this.props;
        return (
            <div className={styles.row}>
                {index + 1}
                <div className={styles.front}>
                    <Input
                        value={card.front}
                        onChange={this.updateFront}
                        placeholder="Enter term"
                    />
                    Term
                </div>
                <div>
                    <Input
                        value={card.back}
                        onChange={this.updateBack}
                        placeholder="Enter definition"
                    />
                    Definition
                </div>
            </div>
        );
    }
}

export default CardRow;
