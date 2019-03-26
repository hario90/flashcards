import { Button, Progress } from "antd";
import * as classNames from "classnames";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import { isEmpty, sample } from "lodash";
import * as React from "react";
import { connect } from "react-redux";

import FlipOptions from "../../components/FlipOptions";
import StackOfCards from "../../components/StackOfCards";
import TwoSidedCard from "../../components/TwoSidedCard";
import { defaultDeck } from "../../state/deck/constants";
import { getSelectedDeck } from "../../state/deck/selectors";
import { Card, Deck } from "../../state/deck/types";
import { setPage } from "../../state/page/actions";
import { Page, SetPageAction } from "../../state/page/types";
import { getNextCard, getPreviousCard, shuffleDeck } from "../../state/selection/actions";
import { getCurrentCard, getSeenCards, getUnseenCards } from "../../state/selection/selectors";
import { GetNextCardAction, GetPreviousCardAction, ShuffleDeckAction } from "../../state/selection/types";

import {
    State,
} from "../../state/types";

const styles = require("./style.pcss");
const congratulatoryPhrases = [
    "Good Job!",
    "Nice Work!",
    "Yee-haw!",
    "Woot woot!",
    "Phew!",
    "Aww yeah.",
];

interface FlipProps {
    className?: string;
    deck: Deck;
    seenCards: Card[];
    unseenCards: Card[];
    currentCard?: Card;
    getNext: () => GetNextCardAction;
    getPrevious: () => GetPreviousCardAction;
    shuffleDeck: () => ShuffleDeckAction;
    setPage: (page: Page) => SetPageAction;
}

interface FlipState {
    front: string[];
    back: string[];
    dealSeen: boolean;
    discardToUnseen: boolean;
    showFront: boolean;
    discardToSeen: boolean;
    currentCard?: Card;
}

class Flip extends React.Component<FlipProps, FlipState> {
    private kuroshiro = new Kuroshiro();
    private converterReady: boolean = false;

    constructor(props: FlipProps) {
        super(props);
        this.state = {
            back: ["english"],
            currentCard: props.currentCard,
            dealSeen: false,
            discardToSeen: false,
            discardToUnseen: false,
            front: ["japanese", "kanji"],
            showFront: true,
        };
        this.getNext = this.getNext.bind(this);
        this.getPrevious = this.getPrevious.bind(this);
        this.renderBody = this.renderBody.bind(this);
        this.startOver = this.startOver.bind(this);
        this.goToCreateDeck = this.goToCreateDeck.bind(this);

        this.kuroshiro.init(new KuromojiAnalyzer()).then(() => {
            this.converterReady = true;
        });
    }

    public componentDidMount() {
        this.getNext();
    }

    public async componentDidUpdate(prevProps: FlipProps) {
        if (prevProps.currentCard !== this.props.currentCard) {
            const { currentCard } = this.props;
            const { back, front } = this.state;
            const actualCurrentCard = currentCard ? await this.getCurrentCard(currentCard, front, back) : undefined;
            this.setState({
                currentCard: actualCurrentCard,
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

    public startOver(): void {
        this.props.shuffleDeck();
        this.props.getNext();
    }

    public goToCreateDeck(): void {
        this.props.setPage(Page.CreateDeck);
    }

    public renderBody() {
        const { seenCards, unseenCards } = this.props;
        const { currentCard } = this.state;
        if (!currentCard) {
            if (!isEmpty(unseenCards)) {
                return null;
            }

            if (isEmpty(seenCards)) {
                return (
                    <div className={styles.learningComplete}>
                        <h2>No cards!</h2>
                        <Button
                            size="large"
                            type="primary"
                            onClick={this.goToCreateDeck}
                        >
                            Add cards to deck
                        </Button>
                    </div>
                );
            }

            const phrase = sample(congratulatoryPhrases);
            return (
                <div className={styles.learningComplete}>
                    <h2>{phrase}</h2>
                    <Button
                        size="large"
                        type="primary"
                        onClick={this.startOver}
                    >
                        Start Over
                    </Button>
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
        const { front, back } = this.state;
        const percentComplete: number = Math.round(100 * (seenCards.length / deck.cards.length));

        return (
            <div className={classNames(className, styles.container)}>
                <FlipOptions
                    className={styles.options}
                    front={front}
                    back={back}
                    onBackChange={this.onBackChange}
                    onFrontChange={this.onFrontChange}
                />
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
                            icon="left"
                            shape="circle"
                        />
                        <div className={styles.completed}>
                            Completed {seenCards.length} out of {deck.cards.length} cards
                        </div>
                        <Button
                            size="large"
                            disabled={!currentCard}
                            onClick={this.getNext}
                            className={styles.navigationButton}
                            icon="right"
                            shape="circle"
                        />
                    </div>
                </div>
            </div>
        );
    }

    private onBackChange = async (backSettings: string[]) => {
        const { currentCard } = this.props;
        const { front } = this.state;
        const actualCurrentCard = currentCard ? await this.getCurrentCard(currentCard, front, backSettings) : undefined;
        this.setState({back: backSettings, currentCard: actualCurrentCard});
    }

    private onFrontChange = async (frontSettings: string[]) => {
        const { currentCard } = this.props;
        const { back } = this.state;
        const actualCurrentCard = currentCard ? await this.getCurrentCard(currentCard, frontSettings, back) : undefined;
        this.setState({front: frontSettings, currentCard: actualCurrentCard});
    }

    private applyJapaneseSettings = async (word: string, target: string): Promise<string> => {
        if (this.converterReady && (target === "hiragana" || target === "romaji")) {
            return await this.kuroshiro.convert(word, {mode: "normal", to: target});
        }

        return word;
    }

    private getCurrentCard = async (currentCard: Card, frontSettings: string[], backSettings: string[]) => {
        if (currentCard && frontSettings.length > 0 && backSettings.length > 0) {
            const frontIsJapanese = frontSettings[0] === "japanese";
            const front = frontIsJapanese ? await this.applyJapaneseSettings(currentCard.front, frontSettings[1])
                : currentCard.back;
            const backIsJapanese = backSettings[0] === "japanese";
            const back = backIsJapanese ? await this.applyJapaneseSettings(currentCard.front, backSettings[1])
                : currentCard.back;
            return {
                ...this.props.currentCard,
                back,
                front,
            };
        }

        return currentCard;
    }
}

function mapStateToProps(state: State) {
    return {
        currentCard: getCurrentCard(state),
        deck: getSelectedDeck(state) || defaultDeck,
        seenCards: getSeenCards(state),
        unseenCards: getUnseenCards(state),
    };
}

const dispatchToPropsMap = {
    getNext: getNextCard,
    getPrevious: getPreviousCard,
    setPage,
    shuffleDeck,
};

export default connect(mapStateToProps, dispatchToPropsMap)(Flip);
