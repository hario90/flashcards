import { Avatar, Button, Icon, Popover } from "antd";
import * as classNames from "classnames";
import * as React from "react";

import { GoBackAction, Page, SetPageAction } from "../../state/page/types";
import { SignOutAction } from "../../state/user/types";

const styles = require("./style.pcss");

interface AppHeaderProps {
    className?: string;
    goBack: () => GoBackAction;
    previousPage?: Page;
    previousTitle?: string;
    title: string;
    avatarSrc?: string;
    firstName: string;
    lastName: string;
    isLoggedIn: boolean;
    signOut: () => SignOutAction;
    setPage: (page: Page) => SetPageAction;
}

interface AppHeaderState {
    profileTooltipVisible: boolean;
}

class AppHeader extends React.Component<AppHeaderProps, AppHeaderState> {
    constructor(props: AppHeaderProps) {
        super(props);
        this.state = {
            profileTooltipVisible: false,
        };
    }

    public hide = () => {
        this.setState({
            profileTooltipVisible: false,
        });
    }

    public signOut = () => {
        this.props.signOut();
        this.hide();
    }

    public goToProfile = () => {
        this.props.setPage(Page.Profile);
        this.hide();
    }

    public handleVisibleChange = (profileTooltipVisible: boolean) => {
        this.setState({ profileTooltipVisible });
    }

    public render() {
        const {
            className,
            firstName,
            isLoggedIn,
            lastName,
            previousPage,
            previousTitle,
            title,
        } = this.props;

        return (
            <div className={classNames(styles.container, className)}>
                {previousPage !== undefined ?
                    <Button
                        className={styles.goBack}
                        type="default"
                        onClick={this.goBack}
                        ghost={true}
                        size="large"
                    >
                        <Icon type="left"/>
                        {`Back to ${previousTitle}`}
                    </Button> : <div className={styles.spacer}/>
                }
                <h1>{title}</h1>
                {isLoggedIn && <Popover
                    placement="bottomRight"
                    title={`${firstName} ${lastName}`}
                    content={this.popoverContent()}
                    trigger="click"
                    visible={this.state.profileTooltipVisible}
                    onVisibleChange={this.handleVisibleChange}
                >
                    {this.getAvatar()}
                </Popover>}
            </div>
        );
    }

    public goBack = (): void => {
        this.props.goBack();
    }

    private popoverContent = () => (
        <React.Fragment>
            <a className={styles.userPopoverLink} onClick={this.goToProfile}>Profile</a>
            <a className={styles.userPopoverLink} onClick={this.signOut}>Sign Out</a>
        </React.Fragment>
    )

    private getAvatar = () => {
        const {
            avatarSrc,
            firstName,
            lastName,
        } = this.props;

        if (avatarSrc) {
            return <Avatar className={styles.user} src={avatarSrc}/>;
        }

        return <Avatar className={styles.user}>{firstName.charAt(0) + lastName.charAt(0)}</Avatar>;
    }
}

export default AppHeader;
