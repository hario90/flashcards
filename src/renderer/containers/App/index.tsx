import { message } from "antd";
import "antd/dist/antd.less";
import { includes } from "lodash";
import * as React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";

import AlertBody from "../../components/AlertBody";
import AppHeader from "../../components/AppHeader";
import SideNav from "../../components/SideNav";
import { State } from "../../state";
import { getDeckActionsDisabled } from "../../state/deck/selectors";
import { clearAlert } from "../../state/feedback/actions";
import { getAlert } from "../../state/feedback/selectors";
import { AlertType, AppAlert } from "../../state/feedback/types";
import { goBack, setPage } from "../../state/page/actions";
import { pagesForAllUsers, previousPageMap } from "../../state/page/constants";
import { getPage, getPreviousTitle, getTitle } from "../../state/page/selectors";
import {
    GoBackAction,
    Page, SetPageAction,
} from "../../state/page/types";
import { getDeckActionsHidden } from "../../state/selection/selectors";
import { signOut } from "../../state/user/actions";
import { getAvatarSrc, getFirstName, getLastName, getUserIsLoggedIn } from "../../state/user/selectors";
import { SignOutAction } from "../../state/user/types";

import CreateDeck from "../CreateDeck";
import Flip from "../Flip";
import Home from "../Home";
import Login from "../Login";
import Match from "../Match";
import Profile from "../Profile";
import Signup from "../SignUp";
import Test from "../Test";

const styles = require("./style.pcss");

interface AppProps {
    avatarSrc?: string;
    alert?: AppAlert;
    className?: string;
    disableDeckActions: boolean;
    dispatch: (action: AnyAction) => AnyAction;
    firstName: string;
    goBack: () => GoBackAction;
    isLoggedIn: boolean;
    lastName: string;
    page: Page;
    previousPage?: Page;
    previousTitle?: string;
    setPage: (page: Page) => SetPageAction;
    showDeckActions: boolean;
    signOut: () => SignOutAction;
    title: string;
}

const pageComponentMap: Map<Page, (className?: string) => JSX.Element> = new Map([
    [Page.Home, (className?: string) => <Home className={className}/>],
    [Page.CreateDeck, (className?: string) => <CreateDeck  className={className}/>],
    [Page.Test, (className?: string) => <Test className={className}/>],
    [Page.Flip, (className?: string) => <Flip className={className}/>],
    [Page.Login, (className?: string) => <Login className={className}/>],
    [Page.Signup, (className?: string) => <Signup className={className}/>],
    [Page.ForgotPassword, (className?: string) => <div className={className}>Forgot Password</div>],
    [Page.Match, (className?: string) => <Match className={className}/>],
    [Page.Profile, (className?: string) => <Profile className={className}/>],
]);

const pagesWithoutSideNav = pagesForAllUsers;

const ALERT_DURATION_SECONDS = 2;

class App extends React.Component<AppProps, {}> {
    constructor(props: AppProps) {
        super(props);
    }

    public componentDidUpdate() {
        const { alert, dispatch } = this.props;
        if (alert) {
            const { message: alertText, type} = alert;
            const alertBody = (
                <AlertBody
                    message={alertText}
                />
            );

            switch (type) {
                case AlertType.WARN:
                    message.warn(alertBody, ALERT_DURATION_SECONDS);
                    break;
                case AlertType.SUCCESS:
                    message.success(alertBody, ALERT_DURATION_SECONDS);
                    break;
                case AlertType.ERROR:
                    message.error(alertBody, ALERT_DURATION_SECONDS);
                    break;
                default:
                    message.info(alertBody, ALERT_DURATION_SECONDS);
                    break;
            }
            dispatch(clearAlert());
        }
    }

    public render() {
        const {
            avatarSrc,
            disableDeckActions,
            firstName,
            goBack: goBackProp,
            isLoggedIn,
            lastName,
            page,
            previousPage,
            previousTitle,
            setPage: setPageProp,
            showDeckActions,
            signOut: signOutProp,
            title,
        } = this.props;
        const showSideNav = !includes(pagesWithoutSideNav, page);
        const PageComponent = pageComponentMap.get(page) || ((className?: string) => <Home className={className}/>);
        return (
            <div className={styles.container}>
                <AppHeader
                    goBack={goBackProp}
                    isLoggedIn={isLoggedIn}
                    previousPage={previousPage}
                    previousTitle={previousTitle}
                    title={title}
                    className={styles.header}
                    avatarSrc={avatarSrc}
                    firstName={firstName}
                    lastName={lastName}
                    setPage={setPageProp}
                    signOut={signOutProp}
                />
                <div className={styles.mainContent}>
                    {showSideNav && <SideNav
                        className={styles.sideNav}
                        currentPage={page}
                        disableDeckActions={disableDeckActions}
                        setPage={setPageProp}
                        showDeckActions={showDeckActions}
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
        avatarSrc: getAvatarSrc(state),
        disableDeckActions: getDeckActionsDisabled(state),
        firstName: getFirstName(state) || "",
        isLoggedIn: getUserIsLoggedIn(state),
        lastName: getLastName(state) || "",
        page: getPage(state),
        previousPage: previousPageMap.get(getPage(state)),
        previousTitle: getPreviousTitle(state),
        showDeckActions: !getDeckActionsHidden(state),
        title: getTitle(state),
    };
}

const dispatchToPropsMap = {
    dispatch: (action: AnyAction) => action,
    goBack,
    setPage,
    signOut,
};

export default connect(mapStateToProps, dispatchToPropsMap)(App);
