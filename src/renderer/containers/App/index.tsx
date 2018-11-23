import { Button, Icon } from "antd";
import * as React from "react";
import { connect } from "react-redux";
import AppHeader from "../../components/AppHeader/index";

import { goBack, setPage } from "../../state/page/actions";
import { previousPageMap } from "../../state/page/constants";
import { getPage, getTitle } from "../../state/page/selectors";
import {
    GoBackAction,
    Page,
} from "../../state/page/types";
import { State } from "../../state/types";
import "../../styles/fonts.css";

import CreateDeck from "../CreateDeck";
import Home from "../Home";
import Learn from "../Learn";
import Test from "../Test";

const styles = require("./style.css");

interface AppProps {
    className?: string;
    goBack: () => GoBackAction;
    page: Page;
    previousPage: Page;
    title: string;
}

const pageComponentMap: Map<Page, JSX.Element> = new Map([
    [Page.Home, <Home key={Page.Home}/>],
    [Page.CreateDeck, <CreateDeck key={Page.CreateDeck}/>],
    [Page.Test, <Test key={Page.Test}/>],
    [Page.Learn, <Learn key={Page.Learn}/>],
]);

class App extends React.Component<AppProps, {}> {
    constructor(props: AppProps) {
        super(props);
    }

    public render() {
        const {
            goBack: goBackProp,
            page,
            previousPage,
            title,
        } = this.props;
        return (
            <div className={styles.container}>
                <AppHeader goBack={goBackProp} previousPage={previousPage} title={title} className={styles.header}/>
                <div className={styles.mainContent}>
                    {pageComponentMap.get(page)}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: State): Partial<AppProps> {
    return {
        page: getPage(state),
        previousPage: previousPageMap.get(getPage(state)),
        title: getTitle(state),
    };
}

const dispatchToPropsMap = {
    goBack,
    setPage,
};

export default connect(mapStateToProps, dispatchToPropsMap)(App);
