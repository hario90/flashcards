import { message } from "antd";
import "antd/dist/antd.less";
import { includes } from "lodash";
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
import { pagesForAllUsers, previousPageMap } from "../../state/page/constants";
import { getPage, getPreviousTitle, getTitle } from "../../state/page/selectors";
import {
    GoBackAction,
    Page, SetPageAction,
} from "../../state/page/types";
import { getDeckActionsDisabled } from "../../state/selection/selectors";
import { State } from "../../state/types";
import { signOut } from "../../state/user/actions";
import "../../styles/fonts.css";

import { getAvatarSrc, getFirstName, getLastName, getUserIsLoggedIn } from "../../state/user/selectors";
import { SignOutAction } from "../../state/user/types";

import CreateDeck from "../CreateDeck";
import Flip from "../Flip";
import Home from "../Home";
import Login from "../Login";
import Signup from "../SignUp";
import Test from "../Test";

const styles = require("./style.css");

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
    previousPage: Page;
    previousTitle: string;
    setPage: (page: Page) => SetPageAction;
    signOut: () => SignOutAction;
    title: string;
}

const pageComponentMap: Map<Page, (className?: string) => JSX.Element> = new Map([
    [Page.Home, (className?: string) => <Home className={className}/>],
    [Page.CreateDeck, (className?: string) => <CreateDeck  className={className}/>],
    [Page.Test, (className?: string) => <Test  className={className}/>],
    [Page.Flip, (className?: string) => <Flip className={className}/>],
    [Page.Login, (className?: string) => <Login className={className}/>],
    [Page.Signup, (className?: string) => <Signup className={className}/>],
    [Page.ForgotPassword, (className?: string) => <div className={className}>Forgot Password</div>],
]);

const pagesWithoutSideNav = pagesForAllUsers;

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
                    message.success(alertBody, 2);
                    dispatchClearAlert();
                    break;
                case AlertType.ERROR:
                    message.error(alertBody, 2);
                    dispatchClearAlert();
                    break;
                default:
                    message.info(alertBody, 2);
                    dispatchClearAlert();
                    break;
            }
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
                    signOut={signOutProp}
                />
                <div className={styles.mainContent}>
                    {showSideNav && <SideNav
                        className={styles.sideNav}
                        currentPage={page}
                        disableDeckActions={disableDeckActions}
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
        avatarSrc: getAvatarSrc(state),
        disableDeckActions: getDeckActionsDisabled(state),
        firstName: getFirstName(state),
        isLoggedIn: getUserIsLoggedIn(state),
        lastName: getLastName(state),
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
    signOut,
};

export default connect(mapStateToProps, dispatchToPropsMap)(App);
