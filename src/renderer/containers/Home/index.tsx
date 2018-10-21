import {
    Button,
    Input
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
    Deck,
} from "../../state/deck/types";
import { setPage } from "../../state/page/actions";
import {
    Page,
    SetPageAction,
} from "../../state/page/types";
import {
    State
} from "../../state/types";

interface HomeProps {
    decks: Deck[];
    createDeck: (deckId: string) => CreateDeckAction;
    setPage: (page: Page) => SetPageAction;
}

interface HomeState {
    cards: Card[];
    deckName: string;
    error: string;
}

class Home extends React.Component<HomeProps, HomeState> {
    public state: HomeState = {
        cards: [],
        deckName: "",
        error: "",
    };

    constructor(props: HomeProps) {
        super(props);
        this.createDeck = this.createDeck.bind(this);
        this.updateDeckName = this.updateDeckName.bind(this);
    }

    public updateDeckName(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({
            deckName: event.target.value || "",
        });
    }

    public createDeck(): void {
        const { cards, deckName } = this.state;
        if (this.props.decks.find((deck: Deck) => deck.name === deckName)) {
            this.setState({
                deckName: "",
                error: `Already have deck called ${deckName}`,
            });
        } else {
            this.props.createDeck(deckName);
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
            <div >
                {this.getBody()}
                <Input
                    placeholder="Deck Name"
                    value={this.state.deckName}
                    onChange={this.updateDeckName}
                    onPressEnter={this.createDeck}
                />
                <Button type="primary" onClick={this.createDeck}>New Deck</Button>
                {error && <div>{error}</div>}
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

function mapStateToProps(state: State): Partial<HomeProps> {
    return {
        decks: getDecks(state),
    };
}

const dispatchToPropsMap = {
    createDeck,
    setPage,
};

export default connect(mapStateToProps, dispatchToPropsMap)(Home);
