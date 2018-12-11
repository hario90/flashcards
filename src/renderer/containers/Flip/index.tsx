import { Button, Progress } from "antd";
import * as classNames from "classnames";
import { isEmpty } from "lodash";
import * as React from "react";
import { connect } from "react-redux";

import StackOfCards from "../../components/StackOfCards";
import TwoSidedCard from "../../components/TwoSidedCard";
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
    unseenCards: Card[];
    currentCard?: Card;
    getNext: () => GetNextCardAction;
    getPrevious: () => GetPreviousCardAction;
}

interface FlipState {
    dealSeen: boolean;
    discardToUnseen: boolean;
    showFront: boolean;
    discardToSeen: boolean;
}

class Flip extends React.Component<FlipProps, FlipState> {
    constructor(props: FlipProps) {
        super(props);
        this.state = {
            dealSeen: false,
            discardToSeen: false,
            discardToUnseen: false,
            showFront: true,
        };
        this.getNext = this.getNext.bind(this);
        this.getPrevious = this.getPrevious.bind(this);
        this.renderBody = this.renderBody.bind(this);
    }

    public componentDidMount() {
        this.getNext();
    }

    public componentDidUpdate(prevProps: FlipProps) {
        if (prevProps.currentCard !== this.props.currentCard) {
            this.setState({
                discardToSeen: false,
                discardToUnseen: false,
            });
        }
    }

    public getNext(): void {
        this.setState({
            dealSeen: false,
            discardToSeen: true,
            showFront: true,
        });

        setTimeout(this.props.getNext, 500);
    }

    public getPrevious(): void {
        this.setState({
            dealSeen: true,
            discardToUnseen: true,
            showFront: true,
        });

        setTimeout(this.props.getPrevious, 500);
    }

    public renderBody() {
        const { currentCard, seenCards, unseenCards } = this.props;
        if (!currentCard) {
            if (!isEmpty(unseenCards)) {
                return null;
            }

            const message = !isEmpty(seenCards) ? "No more cards!" : "No cards!";

            return (
                <div className={styles.learningComplete}>
                    {message}
                </div>
            );
        }

        const {dealSeen, discardToUnseen, discardToSeen} = this.state;

        const style = {
            [styles.dealUnseen]: !discardToSeen && !discardToUnseen && !dealSeen,
            [styles.addCardToSeen]: discardToSeen,
            [styles.addCardToUnseen]: discardToUnseen,
            [styles.dealSeen]: !discardToSeen && !discardToUnseen && dealSeen,
        };

        return (
            <TwoSidedCard className={classNames(style)} currentCard={currentCard}/>
        );
    }

    public render() {
        const { className, currentCard, deck, seenCards, unseenCards } = this.props;
        const percentComplete: number = Math.round(100 * (seenCards.length / deck.cards.length));

        return (
            <div className={classNames(className, styles.container)}>
                <div className={styles.deckRow}>
                    <StackOfCards size={unseenCards.length} className={styles.deck}>
                        <div className={styles.count}>{unseenCards.length}</div>
                        <div className={styles.countLabel}>Unseen</div>
                    </StackOfCards>
                    <StackOfCards size={seenCards.length} className={styles.deck}>
                        <div className={styles.count}>{seenCards.length}</div>
                        <div className={styles.countLabel}>Completed</div>
                    </StackOfCards>
                </div>
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
