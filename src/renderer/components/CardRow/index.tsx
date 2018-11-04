import { ChangeEvent } from "react";
import * as React from "react";

import { Card } from "../../state/deck/types";
import LineInput from "../LineInput/index";

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
                <LineInput
                    value={card.front}
                    className={styles.front}
                    onChange={this.updateFront}
                    placeholder="Enter term"
                    label="term"
                />
                <LineInput
                    value={card.back}
                    onChange={this.updateBack}
                    placeholder="Enter definition"
                    label="definition"
                />
            </div>
        );
    }
}

export default CardRow;
