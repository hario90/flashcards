import * as React from "react";
import { connect } from "react-redux";

import { setPage } from "../../state/page/actions";
import { getPage } from "../../state/page/selectors";
import {
    Page
} from "../../state/page/types";
import { State } from "../../state/types";
import CreateDeck from "../CreateDeck";
import Home from "../Home";

const styles = require("./style.css");

interface AppProps {
    page: Page;
}

const pageComponentMap: Map<Page, JSX.Element> = new Map([
    [Page.Home, <Home key={Page.Home}/>],
    [Page.CreateDeck, <CreateDeck key={Page.CreateDeck}/>],
]);

class App extends React.Component<AppProps, {}> {
    constructor(props: AppProps) {
        super(props);
    }

    public render() {
        const { page } = this.props;
        return (
            <div className={styles.container}>
                {pageComponentMap.get(page)}
            </div>
        );
    }
}

function mapStateToProps(state: State): Partial<AppProps> {
    return {
        page: getPage(state),
    };
}

const dispatchToPropsMap = {
    setPage,
};

export default connect(mapStateToProps, dispatchToPropsMap)(App);
