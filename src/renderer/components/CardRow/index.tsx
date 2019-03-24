import { Button, Icon, Input } from "antd";
import * as classNames from "classnames";
import { ChangeEvent } from "react";
import * as React from "react";

import { Card } from "../../state/deck/types";
import LineInput from "../LineInput/index";

const styles = require("./styles.pcss");

interface CardRowProps {
    className?: string;
    card: Card;
    deleteCard: (cardIndex: number) => void;
    index: number;
    onFrontBlur: (index: number, front: string) => Promise<void>;
    updateFront: (i: number, value: string) => void;
    updateBack: (i: number, value: string) => void;
    showMiddle: boolean;
}

interface CardRowState {
    isFrontEditable: boolean;
    isBackEditable: boolean;
}

class CardRow extends React.Component<CardRowProps, CardRowState>  {
    public frontInput?: Input;
    public backInput?: Input;

    constructor(props: CardRowProps) {
        super(props);
        this.state = {
            isBackEditable: true,
            isFrontEditable: true,
        };
    }

    public updateFront = (event: ChangeEvent<HTMLInputElement>): void => {
        const {
            index,
            updateFront,
        } = this.props;
        updateFront(index, event.target.value);
    }

    public updateBack = (event: ChangeEvent<HTMLInputElement>): void => {
        const {
            index,
            updateBack,
        } = this.props;
        updateBack(index, event.target.value);
    }

    public deleteCard = (): void => {
        const {
            deleteCard,
            index,
        } = this.props;
        deleteCard(index);
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
        if (this.frontInput && this.state.isFrontEditable) {
            this.frontInput.focus();
        }
    }

    public render() {
        const { card, className, index, showMiddle } = this.props;
        const { isBackEditable, isFrontEditable } = this.state;
        const frontLabel = showMiddle ? "Japanese" : "term";
        const backLabel = showMiddle ? "English" : "definition";

        return (
            <div className={classNames(className, styles.row)}>
                <div className={styles.cardNumber}>{index + 1}</div>
                {(isFrontEditable || !card.front) ? (
                    <LineInput
                        value={card.front}
                        className={classNames(styles.side, styles.front)}
                        onChange={this.updateFront}
                        placeholder={`Enter ${frontLabel}`}
                        label={frontLabel}
                        ref={(input: LineInput) => { this.frontInput = input ? input.input : undefined; }}
                        onBlur={this.onFrontBlur}
                    />
                ) : (
                    <div
                        className={classNames(styles.side, styles.front, styles.sideReadOnly)}
                        onClick={this.makeEditable(true, true)}
                    >
                        <span className={styles.cardText}>{card.front}</span>
                        <Icon className={styles.editIcon} type="edit"/>
                    </div>
                )}
                {showMiddle && (
                    <div
                        className={classNames(styles.side, styles.middle, styles.sideReadOnly)}
                    >
                        <span className={styles.cardText}>{card.middle}</span>
                    </div>
                )}
                {(isBackEditable || !card.back) ? (
                    <LineInput
                        className={classNames(styles.side, styles.back)}
                        value={card.back}
                        onChange={this.updateBack}
                        placeholder={`Enter ${backLabel}`}
                        label={backLabel}
                        ref={(input: LineInput) => { this.backInput = input ? input.input : undefined; }}
                        onBlur={this.makeEditable(false, false)}
                    />
                ) : (
                    <div
                        className={classNames(styles.side, styles.back, styles.sideReadOnly)}
                        onClick={this.makeEditable(false, true)}
                    >
                        <span className={styles.cardText}>{card.back}</span>
                        <Icon className={styles.editIcon} type="edit"/>
                    </div>
                )}
                <div className={styles.closeButton} >
                    <Button icon="delete" shape="circle" onClick={this.deleteCard}/>
                </div>
            </div>
        );
    }

    private onFrontBlur = () => {
        this.makeEditable(true, false);
        this.props.onFrontBlur(this.props.index, this.props.card.front);
    }
}

export default CardRow;
