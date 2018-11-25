import * as React from "react";
import { connect } from "react-redux";

import AppHeader from "../../components/AppHeader/index";
import SideNav from "../../components/SideNav/index";
import { goBack, setPage } from "../../state/page/actions";
import { previousPageMap } from "../../state/page/constants";
import { getPage, getPreviousTitle, getTitle } from "../../state/page/selectors";
import {
    GoBackAction,
    Page, SetPageAction,
} from "../../state/page/types";
import { State } from "../../state/types";
import "../../styles/fonts.css";

import CreateDeck from "../CreateDeck";
import Flip from "../Flip";
import Home from "../Home";
import Test from "../Test";

const styles = require("./style.css");

interface AppProps {
    className?: string;
    goBack: () => GoBackAction;
    page: Page;
    previousPage: Page;
    previousTitle: string;
    setPage: (page: Page) => SetPageAction;
    title: string;
}

const pageComponentMap: Map<Page, (className?: string) => JSX.Element> = new Map([
    [Page.Home, (className?: string) => <Home className={className}/>],
    [Page.CreateDeck, (className?: string) => <CreateDeck  className={className}/>],
    [Page.Test, (className?: string) => <Test  className={className}/>],
    [Page.Flip, (className?: string) => <Flip className={className}/>],
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
            previousTitle,
            setPage: setPageProp,
            title,
        } = this.props;
        const showSideNav = page !== Page.Home;
        const PageComponent = pageComponentMap.get(page) || ((className?: string) => <Home className={className}/>);
        return (
            <div className={styles.container}>
                <AppHeader
                    goBack={goBackProp}
                    previousPage={previousPage}
                    previousTitle={previousTitle}
                    title={title}
                    className={styles.header}
                />
                <div className={styles.mainContent}>
                    {showSideNav && <SideNav
                        className={styles.sideNav}
                        currentPage={page}
                        setPage={setPageProp}
                    />}
                    {PageComponent(styles.page)}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        page: getPage(state),
        previousPage: previousPageMap.get(getPage(state)),
        previousTitle: getPreviousTitle(state),
        title: getTitle(state),
    };
}

const dispatchToPropsMap = {
    goBack,
    setPage,
};

export default connect(mapStateToProps, dispatchToPropsMap)(App);
