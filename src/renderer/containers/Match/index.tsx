import { Button, Dropdown, Menu } from "antd";
import * as classNames from "classnames";
import { includes, isEmpty, shuffle } from "lodash";
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

        this.state = {
            cards: this.createCardsForGame(),
        };
    }

    public createCardsForGame = (limit?: number) => {
        let cards = [...this.props.deck.cards];
        if (limit) {
            cards = shuffle(cards);
            cards = cards.slice(0, limit / 2);
        }

        const fronts: MatchCard[] = cards.map((c) => ({
            card: {
                back: c.front,
                front: "",
                matches: c.back,
            },
            isMatched: false,
        }));
        const backs: MatchCard[] = cards.map((c) => ({
            card: {
                back: c.back,
                front: "",
                matches: c.front,
            },
            isMatched: false,
        }));

        return shuffle([...fronts, ...backs]);
    }

    public onMenuItemClick = ({ key }: {key: string}) => {
        this.restartGameWithLimit(parseInt(key, 10));
    }

    public renderMenu = () => {
        const max = this.props.deck.cards.length * 2;
        const min = 4;

        if (max <= min) {
            return null;
        }

        const numbers = [];
        let i = min;
        while (i <= max) {
            if (i !== this.state.cards.length) {
                numbers.push(i);
            }

            i += 2;
        }

        return (
            <Menu onClick={this.onMenuItemClick}>
                {numbers.map((num) => <Menu.Item key={num}>{num}</Menu.Item>)}
            </Menu>
        );
    }

    public render() {
        const { className } = this.props;
        const { flipIndex1, flipIndex2, cards } = this.state;

        const unmatched = cards.filter((c) => !c.isMatched);

        if (isEmpty(unmatched)) {
            return (
                <div className={styles.body}>
                    <div>Good Job!</div>
                    <Button type="primary" size="large" onClick={this.restartGame}>Start Over</Button>
                </div>
            );
        }

        const menu = this.renderMenu();

        return (
            <div className={classNames(className, styles.container)}>
                <div className={styles.controls}>
                    {menu && <Dropdown overlay={menu}>
                        <a href="#">Change number of cards</a>
                    </Dropdown>}

                </div>
                <div className={styles.cards}>
                    {cards.map((matchCard: MatchCard, i: number) => (
                        <TwoSidedCardPassive
                            className={classNames(styles.card, {[styles.fadeOut]: matchCard.isMatched})}
                            currentCard={matchCard.card}
                            height={180}
                            width={200}
                            key={matchCard.card.back}
                            showTitle={false}
                            onFlip={this.handleFlip(i)}
                            isFlipped={includes([flipIndex1, flipIndex2], i)}
                            frontColor="#92C8A8"
                            backColor="#C5ECAC"
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

    private restartGameWithLimit = (limit: number) => {
        this.setState({
            cards: this.createCardsForGame(limit),
        });
    }

    private restartGame = () => {
        this.setState({
            cards: this.createCardsForGame(),
        });
    }
}

function mapStateToProps(state: State) {
    return {
        deck: getSelectedDeck(state),
    };
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(Match);
