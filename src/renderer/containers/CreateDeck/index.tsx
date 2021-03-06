import {
    Alert,
    Button,
    Icon,
    Input,
} from "antd";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import * as Mousetrap from "mousetrap";
import { ChangeEvent } from "react";
import * as React from "react";
import { connect } from "react-redux";

import CardRow from "../../components/CardRow/index";
import LineInput from "../../components/LineInput/index";
import ShortcutHint from "../../components/ShortcutHint";
import { deleteDeck, saveDeck, saveDraft } from "../../state/deck/actions";
import { defaultDeck } from "../../state/deck/constants";
import { getCanSave, getDraft, getSelectedDeck } from "../../state/deck/selectors";
import { Card, Deck, SaveDeckAction, SaveDraftAction } from "../../state/deck/types";
import { setPage } from "../../state/page/actions";
import { Page, SetPageAction } from "../../state/page/types";
import { selectDeck } from "../../state/selection/actions";
import { SelectDeckAction } from "../../state/selection/types";
import {
    State
} from "../../state/types";
import { getCtrlOrCmd } from "../../util";

const styles = require("./style.pcss");

interface DeckProps {
    className?: string;
    deck: Deck;
    draft: Deck;
    enableSave: boolean;
    saveDeck: () => SaveDeckAction;
    saveDraft: (deck: Deck) => SaveDraftAction;
    selectDeck: (deckId: number) => SelectDeckAction;
    setPage: (page: Page) => SetPageAction;
}

interface DeckState {
    error?: string;
    editingTitle: boolean;
}

const EMPTY_CARD = {
    back: "",
    front: "",
};

class CreateDeck extends React.Component<DeckProps, DeckState> {
    private nameInput?: Input;
    private firstInput?: Input;
    private kuroshiro = new Kuroshiro();
    private converterReady: boolean = false;

    constructor(props: DeckProps) {
        super(props);
        this.state = {
            editingTitle: false,
        };
        this.kuroshiro.init(new KuromojiAnalyzer()).then(() => this.converterReady = true);
    }

    public setEditingTitle = (value: boolean): () => void  => {
        return () => {
            if (!this.props.draft.name && !value) {
                return;
            }
            this.setState({editingTitle: value});
        };
    }

    public updateDeckName = (event: ChangeEvent<HTMLInputElement>): void => {
        this.props.saveDraft({
            ...this.props.draft,
            name: event.target.value,
        });
    }

    public goBack = (): void => {
        this.props.setPage(Page.Home);
    }

    public onSavePressed = (): void => {
        if (this.props.enableSave) {
            this.setState({editingTitle: false});
            this.props.saveDeck();
        }
    }

    public onFrontBlur = async (cardIndex: number, front: string): Promise<void> => {
        const { draft } = this.props;
        const cards = [
            ...draft.cards,
        ];
        let middle = "";
        if (front && this.converterReady) {

            try {
                middle = await this.kuroshiro.convert(front, {mode: "furigana", to: "hiragana"});
            } catch (e) {
                // tslint:disable-next-line
                console.log(e)
            }
        }

        if (middle !== cards[cardIndex].middle) {
            cards[cardIndex] = {
                ...cards[cardIndex],
                middle,
            };
            this.props.saveDraft({
                ...draft,
                cards,
            });
        }
    }

    public updateFront = (cardIndex: number, front: string): void => {
        const { draft } = this.props;
        const cards = [
            ...draft.cards,
        ];

        cards[cardIndex] = {
            ...cards[cardIndex],
            front,
        };
        this.props.saveDraft({
            ...draft,
            cards,
        });
    }

    public updateBack = (cardIndex: number, back: string): void => {
        const { draft } = this.props;
        const cards = [
            ...draft.cards,
        ];
        cards[cardIndex] = {
            ...cards[cardIndex],
            back,
        };
        this.props.saveDraft({
            ...draft,
            cards,
        });
    }

    public addCard = (): void => {
        const { draft } = this.props;
        const cards = [
            ...draft.cards,
            EMPTY_CARD,
        ];
        this.props.saveDraft({
            ...draft,
            cards,
        });
    }

    public deleteCard = (cardIndex: number): void => {
        const { draft } = this.props;
        if (cardIndex > -1 && cardIndex < draft.cards.length) {
            const cards = [...draft.cards];
            cards.splice(cardIndex, 1);
            this.props.saveDraft({
                ...draft,
                cards,
            });
        }
    }

    public componentDidMount(): void {
        if (this.firstInput) {
            this.firstInput.focus();
        }

        Mousetrap.bind(["command+s", "ctrl+s"], () => {
            this.onSavePressed();
            return false;
        });

        Mousetrap.bind(["command+n", "ctrl+n"], () => {
           this.addCard();
           return false;
        });
    }

    public componentDidUpdate(prevProps: DeckProps, prevState: DeckState): void {
        if (this.nameInput && prevState.editingTitle !== this.state.editingTitle) {
            this.nameInput.focus();
        }
    }

    public render() {
        const { className, draft, enableSave } = this.props;
        const { cards, name } = draft;
        const {  editingTitle, error } = this.state;
        return (
            <div className={className}>
                <div className={styles.titleRow}>
                    {(editingTitle || !name) ? (
                        <LineInput
                            className={styles.titleInput}
                            value={name}
                            label="title"
                            placeholder="Deck Name"
                            onChange={this.updateDeckName}
                            ref={(input) => { this.nameInput = input ? input.input : undefined; }}
                            onBlur={this.setEditingTitle(false)}
                        />
                    ) : (
                        <div className={styles.titleReadOnly} onClick={this.setEditingTitle(true)}>
                            <h1>{name}</h1>
                            <Icon
                                className={styles.editIcon}
                                type="edit"
                            />
                        </div>
                    )}
                    <div className={styles.saveButton}>
                        <Button
                            type="primary"
                            onClick={this.onSavePressed}
                            size="large"
                            disabled={!enableSave}
                        >
                            Save
                        </Button>
                        <ShortcutHint visible={enableSave} hint={`${getCtrlOrCmd()}+S`}/>
                    </div>
                </div>
                <div className={styles.cards}>
                    {error && <Alert
                        message="Could Not Save Deck"
                        description={error}
                        type="error"
                        showIcon={true}
                    />}
                    {cards.map((card: Card, i: number) => {
                        if (i === 0) {
                            return (
                                <CardRow
                                    updateFront={this.updateFront}
                                    updateBack={this.updateBack}
                                    deleteCard={this.deleteCard}
                                    key={i}
                                    index={i}
                                    card={card}
                                    ref={(row) => {
                                        this.firstInput = row ? row.frontInput : undefined;
                                    }}
                                    showMiddle={draft.type === "THREE_WAY"}
                                    onFrontBlur={this.onFrontBlur}
                                />
                            );
                        }

                        return (
                            <CardRow
                                updateFront={this.updateFront}
                                updateBack={this.updateBack}
                                deleteCard={this.deleteCard}
                                key={i}
                                index={i}
                                card={card}
                                showMiddle={draft.type === "THREE_WAY"}
                                onFrontBlur={this.onFrontBlur}
                            />
                        );
                    })}
                    <div className={styles.addCard} onClick={this.addCard}>
                        <Icon type="plus" className={styles.plus}/>Add Card&nbsp;
                        <ShortcutHint hint={`${getCtrlOrCmd()}+N`} visible={true}/>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        deck: getSelectedDeck(state) || defaultDeck,
        draft: getDraft(state) || defaultDeck,
        enableSave: getCanSave(state),
    };
}

const dispatchToPropsMap = {
    deleteDeck,
    saveDeck,
    saveDraft,
    selectDeck,
    setPage,
};

export default connect(mapStateToProps, dispatchToPropsMap)(CreateDeck);
