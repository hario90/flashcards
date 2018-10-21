import {
    Button,
    Input
} from "antd";
import { isEmpty } from "lodash";
import * as React from "react";
import { ChangeEvent } from "react";
import { connect } from "react-redux";

import DeckRow from "../../components/DeckRow/index";
import { createDeck } from "../../state/deck/actions";
import { getDecks } from "../../state/deck/selectors";
import {
    CreateDeckAction,
    Deck,
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
    createDeck: (deck: Deck) => CreateDeckAction;
    selectDeck: (deckId: number | number[]) => SelectDeckAction;
    setPage: (page: Page) => SetPageAction;
}

interface HomeState {
    deckName: string;
    error: string;
}

class Home extends React.Component<HomeProps, HomeState> {
    public state: HomeState = {
        deckName: "",
        error: "",
    };

    constructor(props: HomeProps) {
        super(props);
        this.createDeck = this.createDeck.bind(this);
        this.updateDeckName = this.updateDeckName.bind(this);
        this.selectDeck = this.selectDeck.bind(this);
    }

    public selectDeck(deckId: number | number[]): void {
        console.log("selected deck " + deckId);
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
                error: `Already have deck called ${deckName}`,
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

    public render() {
        const { error } = this.state;
        return (
            <div>
                <h1>Your Decks</h1>
                {this.getBody()}
                <div className={styles.createDeckRow}>
                    <Input
                        placeholder="Deck Name"
                        value={this.state.deckName}
                        onChange={this.updateDeckName}
                        onPressEnter={this.createDeck}
                    />
                    <Button type="primary" onClick={this.createDeck}>New Deck</Button>
                </div>
                {error && <div className={styles.error}>{error}</div>}
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
                {decks.map((deck) => <DeckRow key={deck.id} deck={deck} selectDeck={this.selectDeck}/>)}
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
    selectDeck,
    setPage,
};

export default connect(mapStateToProps, dispatchToPropsMap)(Home);
