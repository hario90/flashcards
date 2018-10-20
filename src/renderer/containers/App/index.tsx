import {
    Button,
    Input,
} from "antd";
import { isEmpty } from "lodash";
import * as React from "react";
import { ChangeEvent } from "react";
import { connect } from "react-redux";

import { createDeck } from "../../state/deck/actions";
import { getDecks } from "../../state/deck/selectors";
import {
    Card,
    CreateDeckAction,
    Deck
} from "../../state/deck/types";
import { State } from "../../state/types";

const styles = require("./style.css");

interface AppProps {
    decks: Deck[];
    createDeck: (deck: Deck) => CreateDeckAction;
}

interface AppState {
    cards: Card[];
    deckName: string;
}

class App extends React.Component<AppProps, AppState> {
    public state: AppState = {
        cards: [],
        deckName: "",
    };
    constructor(props: AppProps) {
        super(props);
        this.createDeck = this.createDeck.bind(this);
        this.updateDeckName = this.updateDeckName.bind(this);
    }

    public updateDeckName(val: ChangeEvent<HTMLInputElement>): void {
        this.setState({
            deckName: val.target.value || "",
        });
    }
    public createDeck(): void {
        const { cards, deckName } = this.state;
        this.props.createDeck({
            cards,
            name: deckName,
        });
        this.setState({deckName: ""});
    }

    public render() {
        return (
            <div className={styles.container}>
                {this.getBody()}
                <Input placeholder="Deck Name" value={this.state.deckName} onChange={this.updateDeckName}/>
                <Button type="primary" onClick={this.createDeck}>New Deck</Button>
            </div>
        );
    }

    private getBody(): JSX.Element {
        const { decks } = this.props;
        if (isEmpty(decks)) {
            return (
                <div>No decks started. Why don't you create one?</div>
            );
        }

        return (
            <div>
                {decks.map((deck) => <div key={deck.name}>{deck.name} {deck.cards.length} cards</div>)}
            </div>
        );
    }
}

function mapStateToProps(state: State): Partial<AppProps> {
    return {
        decks: getDecks(state),
    };
}

const dispatchToPropsMap = {
    createDeck,
};

export default connect(mapStateToProps, dispatchToPropsMap)(App);
