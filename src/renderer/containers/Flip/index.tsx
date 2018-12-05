import { Button, Progress } from "antd";
import * as classNames from "classnames";
import { isEmpty } from "lodash";
import * as React from "react";
import { connect } from "react-redux";

import TwoSidedCard from "../../components/TwoSidedCard/index";
import { getSelectedDeck } from "../../state/deck/selectors";
import { Card, Deck } from "../../state/deck/types";
import { getNextCard, getPreviousCard } from "../../state/selection/actions";
import { getCurrentCard, getSeenCards, getUnseenCards } from "../../state/selection/selectors";
import { GetNextCardAction, GetPreviousCardAction } from "../../state/selection/types";

import {
    State,
} from "../../state/types";

const styles = require("./style.css");

interface FlipProps {
    className?: string;
    deck: Deck;
    seenCards: Card[];
    currentCard?: Card;
    getNext: () => GetNextCardAction;
    getPrevious: () => GetPreviousCardAction;
}

class Flip extends React.Component<FlipProps, {}> {
    constructor(props: FlipProps) {
        super(props);
        this.state = {
            showFront: true,
        };
        this.getNext = this.getNext.bind(this);
        this.getPrevious = this.getPrevious.bind(this);
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

    public renderBody() {
        const { currentCard, seenCards } = this.props;
        if (!currentCard) {
            const message = !isEmpty(seenCards) ? "No more cards!" : "No cards!";

            return (
                <div className={styles.learningComplete}>
                    {message}
                </div>
            );
        }

        return (
           <TwoSidedCard currentCard={currentCard}/>
        );
    }

    public render() {
        const { className, currentCard, deck, seenCards } = this.props;
        const percentComplete: number = Math.round(100 * (seenCards.length / deck.cards.length));

        return (
            <div className={classNames(className, styles.container)}>
                <div className={styles.body}>
                    {this.renderBody()}
                </div>
                <div className={styles.completed}>
                    <Progress percent={percentComplete} />
                    <div className={styles.navigationFooter}>
                        <Button
                            size="large"
                            onClick={this.getPrevious}
                            disabled={isEmpty(seenCards)}
                            className={styles.navigationButton}
                        >
                            Previous
                        </Button>
                        <div className={styles.completed}>
                            Completed {seenCards.length} out of {deck.cards.length} cards
                        </div>
                        <Button
                            size="large"
                            disabled={!currentCard}
                            onClick={this.getNext}
                            className={styles.navigationButton}
                        >
                            Next
                        </Button>
                    </div>
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

export default connect(mapStateToProps, dispatchToPropsMap)(Flip);
