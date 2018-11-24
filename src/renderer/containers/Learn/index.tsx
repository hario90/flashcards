import { Button, Card as AntdCard } from "antd";
import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import { Card, Deck } from "../../state/deck/types";
import { getNextCard } from "../../state/selection/actions";
import { getCurrentCard, getSeenCards, getSelectedDeck, getUnseenCards } from "../../state/selection/selectors";
import { GetNextCardAction } from "../../state/selection/types";

import {
    State,
} from "../../state/types";

const styles = require("./style.css");

interface LearnProps {
    className?: string;
    deck: Deck;
    seenCards: Card[];
    currentCard?: Card;
    getNext: () => GetNextCardAction;
}

interface LearnState {
    showFront: boolean;
}

class Learn extends React.Component<LearnProps, LearnState> {
    constructor(props: LearnProps) {
        super(props);
        this.state = {
            showFront: true,
        };
        this.getNext = this.getNext.bind(this);
        this.flipCard = this.flipCard.bind(this);
    }

    public getNext(): void {
        this.props.getNext();
        this.setState({
            showFront: true,
        });
    }

    public flipCard(): void {
        this.setState({showFront: !this.state.showFront});
    }

    public render() {
        const { className, deck, currentCard, seenCards } = this.props;
        const { showFront } = this.state;

        if (!currentCard) {
            return <div>Learning is complete!</div>;
        }

        const hover = {
            [styles.hover]: !showFront,
        };

        return (
            <div className={classNames(className, styles.container)}>
                <div
                    className={classNames(styles.flipContainer, hover)}
                    onClick={this.flipCard}
                >
                    <div className={styles.flipper}>
                        <AntdCard
                            title="Term"
                            className={classNames(styles.card, styles.front)}
                            actions={[
                                <Button key="flip" onClick={this.flipCard}>Flip</Button>,
                                <Button key="next" onClick={this.getNext}>Next</Button>,
                            ]}
                        >
                            <p>{currentCard.front}</p>
                        </AntdCard>
                        <AntdCard
                            title="Definition"
                            className={classNames(styles.card, styles.back)}
                            actions={[
                                <Button key="flip" onClick={this.flipCard}>Flip</Button>,
                                <Button key="next" onClick={this.getNext}>Next</Button>,
                            ]}
                        >
                            <p>{currentCard.back}</p>
                        </AntdCard>
                    </div>
                </div>
                <div className={styles.completed}>Completed {seenCards.length} out of {deck.cards.length} cards</div>
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        currentCard: getCurrentCard(state),
        deck: getSelectedDeck(state),
        seenCards: getSeenCards(state),
        unseenCards: getUnseenCards(state),
    };
}

const dispatchToPropsMap = {
    getNext: getNextCard,
};

export default connect(mapStateToProps, dispatchToPropsMap)(Learn);
