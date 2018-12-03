import { message } from "antd";
import * as React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";

import AlertBody from "../../components/AlertBody";
import AppHeader from "../../components/AppHeader";
import SideNav from "../../components/SideNav";
import { clearAlert } from "../../state/feedback/actions";
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
        if (alert && alert.onNo) {
            dispatch(alert.onNo);
        }
    }

    public acceptAlert = () => {
        const { alert, dispatch } = this.props;
        if (alert && alert.onYes) {
            dispatch(alert.onYes);
        }
    }

    public componentDidUpdate() {
        const { alert, dispatch } = this.props;
        if (alert) {
            const { message: alertText, type, onNo, onYes} = alert;
            const alertBody = (
                <AlertBody
                    message={alertText}
                    onNo={onNo ? this.dismissAlert : undefined}
                    onYes={onYes ? this.acceptAlert : undefined}
                />
            );
            const dispatchClearAlert = () => dispatch(clearAlert());
            switch (type) {
                case AlertType.WARN:
                    message.warn(alertBody, 0, dispatchClearAlert);
                    break;
                case AlertType.SUCCESS:
                    message.success(alertBody, 3, dispatchClearAlert);
                    break;
                case AlertType.ERROR:
                    message.error(alertBody, 3, dispatchClearAlert);
                    break;
                default:
                    message.info(alertBody, 3, dispatchClearAlert);
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
