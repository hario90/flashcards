import { Button, Card as AntdCard, Progress } from "antd";
import * as classNames from "classnames";
import { isEmpty } from "lodash";
import * as React from "react";
import { connect } from "react-redux";

import { Card, Deck } from "../../state/deck/types";
import { getNextCard, getPreviousCard } from "../../state/selection/actions";
import { getCurrentCard, getSeenCards, getSelectedDeck, getUnseenCards } from "../../state/selection/selectors";
import { GetNextCardAction, GetPreviousCardAction } from "../../state/selection/types";

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
    getPrevious: () => GetPreviousCardAction;
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
        this.getPrevious = this.getPrevious.bind(this);
        this.flipCard = this.flipCard.bind(this);
        this.renderBody = this.renderBody.bind(this);
    }

    public getNext(): void {
        this.props.getNext();
        this.setState({
            showFront: true,
        });
    }

    public getPrevious(): void {
        this.props.getPrevious();
        this.setState({
            showFront: true,
        });
    }

    public flipCard(): void {
        this.setState({showFront: !this.state.showFront});
    }

    public renderBody() {
        const { currentCard } = this.props;
        const { showFront } = this.state;

        if (!currentCard) {
            return (
                <div className={styles.learningComplete}>
                   Learning is complete!
                </div>
            );
        }

        const hover = {
            [styles.hover]: !showFront,
        };

        return (
            <div
                className={classNames(styles.flipContainer, hover)}
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

    public render() {
        const { className, deck, seenCards } = this.props;
        const percentComplete: number = Math.round(100 * (seenCards.length / deck.cards.length));

        return (
            <div className={classNames(className, styles.container)}>
                {this.renderBody()}
                <div className={styles.completed}>
                    <Progress percent={percentComplete} />
                    <Button onClick={this.getPrevious} disabled={isEmpty(seenCards)}>Previous</Button>
                    Completed {seenCards.length} out of {deck.cards.length} cards
                    <Button onClick={this.getNext}>Next</Button>
                </div>
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
    getPrevious: getPreviousCard,
};

export default connect(mapStateToProps, dispatchToPropsMap)(Learn);
