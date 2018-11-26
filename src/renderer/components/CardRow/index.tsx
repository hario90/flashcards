import { Button, Icon, Input } from "antd";
import * as classNames from "classnames";
import { ChangeEvent } from "react";
import * as React from "react";

import { Card } from "../../state/deck/types";
import LineInput from "../LineInput/index";

const styles = require("./styles.css");

interface CardRowProps {
    className?: string;
    card: Card;
    deleteCard: (cardIndex: number) => void;
    index: number;
    updateFront: (i: number, value: string) => void;
    updateBack: (i: number, value: string) => void;
}

interface CardRowState {
    isFrontEditable: boolean;
    isBackEditable: boolean;
}

class CardRow extends React.Component<CardRowProps, CardRowState>  {
    private frontInput?: Input;
    private backInput?: Input;

    constructor(props: CardRowProps) {
        super(props);
        this.state = {
            isBackEditable: true,
            isFrontEditable: true,
        };
        this.updateFront = this.updateFront.bind(this);
        this.updateBack = this.updateBack.bind(this);
        this.deleteCard = this.deleteCard.bind(this);
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

    public deleteCard(): void {
        const {
            deleteCard,
            index,
        } = this.props;
        deleteCard(index);
    }

    public componentDidUpdate(prevProps: CardRowProps, prevState: CardRowState): void {
        if (this.frontInput && prevState.isFrontEditable !== this.state.isFrontEditable) {
            this.frontInput.focus();
        } else if (this.backInput && prevState.isBackEditable !== this.state.isBackEditable) {
            this.backInput.focus();
        }
    }

    public makeEditable = (isFront: boolean, isEditable: boolean) => {
        const { card } = this.props;
        if (isFront) {
            return () => {
                if (!card.front && !isEditable) {
                    return;
                }

                this.setState({ isFrontEditable: isEditable });
            };
        } else {
            return () => {
                if (!card.back && !isEditable) {
                    return;
                }

                this.setState({ isBackEditable: isEditable });
            };
        }
    }

    public componentDidMount() {
        if (this.backInput) {
            this.backInput.blur();
        }

        // todo get this to work
        if (this.frontInput && this.props.index === 0) {
            console.log(this.frontInput.focus)
            this.frontInput.focus();
        }
    }

    public render() {
        const { card, className, index } = this.props;
        const { isBackEditable, isFrontEditable } = this.state;

        return (
            <div className={classNames(className, styles.row)}>
                <div className={styles.cardNumber}>{index + 1}</div>
                {(isFrontEditable || !card.front) ? (
                    <LineInput
                        value={card.front}
                        className={classNames(styles.side, styles.front)}
                        onChange={this.updateFront}
                        placeholder="Enter term"
                        label="term"
                        ref={(input) => { this.frontInput = input ? input.input : undefined; }}
                        onBlur={this.makeEditable(true, false)}
                    />
                ) : (
                    <div
                        className={classNames(styles.side, styles.front, styles.sideReadOnly)}
                        onClick={this.makeEditable(true, true)}
                    >
                        <h2>{card.front}</h2>
                        <Icon className={styles.editIcon} type="edit"/>
                    </div>
                )}
                {(isBackEditable || !card.back) ? (
                    <LineInput
                        className={classNames(styles.side, styles.back)}
                        value={card.back}
                        onChange={this.updateBack}
                        placeholder="Enter definition"
                        label="definition"
                        ref={(input) => { this.backInput = input ? input.input : undefined; }}
                        onBlur={this.makeEditable(false, false)}
                    />
                ) : (
                    <div
                        className={classNames(styles.side, styles.back, styles.sideReadOnly)}
                        onClick={this.makeEditable(false, true)}
                    >
                        <h2>{card.back}</h2>
                        <Icon className={styles.editIcon} type="edit"/>
                    </div>
                )}
                <div className={styles.closeButton} >
                    <Button icon="delete" shape="circle" onClick={this.deleteCard}/>
                </div>
            </div>
        );
    }
}

export default CardRow;
