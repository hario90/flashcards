import {
    Alert,
    Button,
    Input,
} from "antd";
import { isEmpty } from "lodash";
import * as React from "react";
import { ChangeEvent } from "react";
import { connect } from "react-redux";

import DeckRow from "../../components/DeckRow/index";
import LineInput from "../../components/LineInput/index";
import { createDeck, deleteDeck } from "../../state/deck/actions";
import { getDecks } from "../../state/deck/selectors";
import {
    CreateDeckAction,
    Deck, DeleteDeckAction,
} from "../../state/deck/types";
import { setPage } from "../../state/page/actions";
import {
    Page,
    SetPageAction,
} from "../../state/page/types";
import { selectDeck } from "../../state/selection/actions";
import { SelectDeckAction } from "../../state/selection/types";
import {
    State
} from "../../state/types";

const styles = require("./style.css");
interface HomeProps {
    decks: Deck[];
    deleteDeck: (id: number) => DeleteDeckAction;
    createDeck: (deck: Deck) => CreateDeckAction;
    selectDeck: (deckId: number | number[]) => SelectDeckAction;
    setPage: (page: Page) => SetPageAction;
}

interface HomeState {
    deckName: string;
    error: string;
    showAlert: boolean;
    deckToDelete?: number;
}

class Home extends React.Component<HomeProps, HomeState> {
    public state: HomeState = {
        deckName: "",
        error: "",
        showAlert: false,
    };

    constructor(props: HomeProps) {
        super(props);
        this.createDeck = this.createDeck.bind(this);
        this.updateDeckName = this.updateDeckName.bind(this);
        this.selectDeck = this.selectDeck.bind(this);
        this.showAlert = this.showAlert.bind(this);
        this.deleteDeck = this.deleteDeck.bind(this);
        this.clearDeckToDelete = this.clearDeckToDelete.bind(this);
    }

    public selectDeck(deckId: number | number[]): void {
        this.props.selectDeck(deckId);
        this.props.setPage(Page.CreateDeck);
    }

    public updateDeckName(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({
            deckName: event.target.value || "",
        });
    }

    public createDeck(): void {
        const { deckName } = this.state;
        if (this.props.decks.find((deck: Deck) => deck.name === deckName)) {
            this.setState({
                deckName: "",
                error: `You already have a deck called ${deckName}`,
                showAlert: false,
            });
        } else {
            this.props.createDeck({
                cards: [],
                id: 0, // this get populated in the logics
                name: deckName,
            });
            this.setState({
                deckName: "",
                error: "",
            });
            this.props.setPage(Page.CreateDeck);
        }
    }

    public deleteDeck(): void {
        if (this.state.deckToDelete) {
            this.props.deleteDeck(this.state.deckToDelete);
        }

        this.clearDeckToDelete();
    }

    public clearDeckToDelete(): void {
        this.setState({deckToDelete: undefined, showAlert: false});
    }

    public showAlert(id: number): void {
        this.setState({showAlert: true, deckToDelete: id, error: ""});
    }

    public render() {
        const { error, showAlert } = this.state;
        const alertButtons = (
            <div className={styles.alertButtonRow}>
                <div onClick={this.clearDeckToDelete}>Cancel</div>
                <div onClick={this.deleteDeck}>Continue</div>
            </div>
        );
        return (
            <div>
                <h1>Your Decks</h1>
                <div className={styles.createDeckRow}>
                    <LineInput
                        placeholder="Deck Name"
                        className={styles.deckInput}
                        value={this.state.deckName}
                        onChange={this.updateDeckName}
                        onPressEnter={this.createDeck}
                        label="title"
                    />
                    <Button
                        className={styles.createDeckBtn}
                        type="primary"
                        size="large"
                        onClick={this.createDeck}
                    >
                        New Deck
                    </Button>
                </div>
                {showAlert && <Alert
                    message="Are you sure you want to delete this deck?"
                    description={alertButtons}
                    type="warning"
                    closable={true}
                    onClose={this.clearDeckToDelete}
                    showIcon={true}
                />}
                {error && <Alert
                    message="Could Not Create Deck"
                    description={error}
                    type="error"
                    showIcon={true}
                />}
                {this.getBody()}
            </div>
        );
    }

    private getBody(): JSX.Element {
        const { decks } = this.props;
        if (isEmpty(decks)) {
            return (
                <div className={styles.body}>No decks started. Why don't you create one?</div>
            );
        }

        return (
            <div className={styles.body}>
                {decks.map((deck) => (
                    <DeckRow
                        key={deck.id}
                        deck={deck}
                        deleteDeck={this.showAlert}
                        selectDeck={this.selectDeck}
                        toBeDeleted={deck.id === this.state.deckToDelete}
                    />))}
            </div>
        );
    }
}

function mapStateToProps(state: State): Partial<HomeProps> {
    return {
        decks: getDecks(state),
    };
}

const dispatchToPropsMap = {
    createDeck,
    deleteDeck,
    selectDeck,
    setPage,
};

export default connect(mapStateToProps, dispatchToPropsMap)(Home);
