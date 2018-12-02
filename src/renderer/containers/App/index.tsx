import { message } from "antd";
import * as React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";

import AlertBody from "../../components/AlertBody/index";
import AppHeader from "../../components/AppHeader/index";
import SideNav from "../../components/SideNav/index";
import { getAlert } from "../../state/feedback/selectors";
import { AlertType, AppAlert } from "../../state/feedback/types";
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
    alert?: AppAlert;
    className?: string;
    dispatch: (action: AnyAction) => AnyAction;
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

    public dismissAlert = (): void => {
        const { alert, dispatch } = this.props;
        if (alert) {
            dispatch(alert.onNo);
        }
    }

    public acceptAlert = () => {
        const { alert, dispatch } = this.props;
        if (alert) {
            dispatch(alert.onYes);
        }
    }

    public componentDidUpdate() {
        const { alert } = this.props;
        if (alert) {
            const { message: alertText, type} = alert;
            switch(type) {
                case AlertType.WARN:
                    message.warn(<AlertBody message={alertText} onNo={this.dismissAlert} onYes={this.acceptAlert}/>, 0);
                    break;
                default:
                    message.info(<AlertBody message={alertText} onNo={this.dismissAlert} onYes={this.acceptAlert}/>);
                    break;
            }
        }
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
        alert: getAlert(state),
        page: getPage(state),
        previousPage: previousPageMap.get(getPage(state)),
        previousTitle: getPreviousTitle(state),
        title: getTitle(state),
    };
}

const dispatchToPropsMap = {
    dispatch: (action: AnyAction) => action,
    goBack,
    setPage,
};

export default connect(mapStateToProps, dispatchToPropsMap)(App);
