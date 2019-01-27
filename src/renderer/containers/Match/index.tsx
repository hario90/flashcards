import * as classNames from "classnames";
import { includes, shuffle } from "lodash";
import * as React from "react";
import { connect } from "react-redux";

import TwoSidedCardPassive from "../../components/TwoSidedCardPassive/index";
import { getSelectedDeck } from "../../state/deck/selectors";
import { Card, Deck } from "../../state/deck/types";

import {
    State,
} from "../../state/types";

const styles = require("./style.css");

interface MatchCard {
    card: HalfCard;
    isMatched: boolean;
}

interface MatchProps {
    className?: string;
    deck: Deck;
}

interface MatchState {
    cards: MatchCard[];
    flipIndex1?: number;
    flipIndex2?: number;
}

interface HalfCard extends Card {
    matches: string;
}

class Match extends React.Component<MatchProps, MatchState> {
    constructor(props: MatchProps) {
        super(props);
        const fronts: MatchCard[] = props.deck.cards.map((c) => ({
            card: {
                back: c.front,
                front: "",
                matches: c.back,
            },
            isMatched: false,
        }));
        const backs: MatchCard[] = props.deck.cards.map((c) => ({
            card: {
                back: c.back,
                front: "",
                matches: c.front,
            },
            isMatched: false,
        }));

        this.state = {
            cards: shuffle([...fronts, ...backs]),
        };
    }

    public render() {
        const { className } = this.props;
        const { flipIndex1, flipIndex2, cards } = this.state;

        const unmatched = cards.filter((c) => !c.isMatched);

        return (
            <div className={classNames(className, styles.container)}>
                <div className={styles.cards}>
                    {cards.map((matchCard: MatchCard, i: number) => (
                        <TwoSidedCardPassive
                            className={styles.card}
                            currentCard={matchCard.card}
                            height={180}
                            width={200}
                            key={matchCard.card.back}
                            showTitle={false}
                            onFlip={this.handleFlip(i)}
                            isFlipped={includes([flipIndex1, flipIndex2], i)}
                            frontColor="#b9cdf7"
                            backColor="#f7b9f7"
                        />
                    ))}
                </div>
            </div>
        );
    }

    public componentDidUpdate(prevProps: MatchProps, prevState: MatchState) {
        const {
            flipIndex1,
            flipIndex2,
            cards,
        } = this.state;
        if (flipIndex1 !== undefined && flipIndex2 !== undefined) {
            const cardsMatch = cards[flipIndex1].card.matches === cards[flipIndex2].card.back;
            if (cardsMatch) {
                const nextCards = [...cards];
                nextCards[flipIndex2].isMatched = nextCards[flipIndex1].isMatched = true;

                setTimeout(() => this.setState({
                    cards: nextCards,
                    flipIndex1: undefined,
                    flipIndex2: undefined,
                }), 1000);
            } else {
                setTimeout(() => this.setState({
                    flipIndex1: undefined,
                    flipIndex2: undefined,
                }), 1000);
            }
        }
    }

    private handleFlip = (index: number) => {
        return (card: Card) => {
            if (this.state.flipIndex1 === undefined) {
                this.setState({flipIndex1: index});
            } else if (this.state.flipIndex1 === index) {
                this.setState({flipIndex1: undefined});
            } else if (this.state.flipIndex2 === undefined) {
                this.setState({flipIndex2: index});
            } else {
                this.setState({flipIndex2: undefined});
            }
        };
    }
}

function mapStateToProps(state: State) {
    return {
        deck: getSelectedDeck(state),
    };
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(Match);
