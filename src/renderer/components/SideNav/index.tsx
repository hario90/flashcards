import { Icon, Tooltip } from "antd";
import * as classNames from "classnames";
import { noop } from "lodash";
import * as React from "react";

import { Page, SetPageAction } from "../../state/page/types";

const styles = require("./style.pcss");

interface SideNavProps {
    className?: string;
    disableDeckActions: boolean;
    setPage: (page: Page) => SetPageAction;
    currentPage: Page;
    showDeckActions: boolean;
}

interface PageLink {
    buttonTitle: string;
    icon: string;
    page: Page;
    theme: "filled" | "twoTone" | "outlined" | undefined;
    requiresDeckSelected: boolean;
    disableWhenNoCards: boolean;
}

const PAGES: PageLink[] = [
    {
        buttonTitle: "Decks",
        disableWhenNoCards: false,
        icon: "appstore",
        page: Page.Home,
        requiresDeckSelected: false,
        theme: "filled",
    },
    {
        buttonTitle: "Edit",
        disableWhenNoCards: false,
        icon: "edit",
        page: Page.CreateDeck,
        requiresDeckSelected: true,
        theme: "filled",
    },
    {
        buttonTitle: "Flip",
        disableWhenNoCards: true,
        icon: "sync",
        page: Page.Flip,
        requiresDeckSelected: true,
        theme: undefined,
    },
    {
        buttonTitle: "Match",
        disableWhenNoCards: true,
        icon: "copy",
        page: Page.Match,
        requiresDeckSelected: true,
        theme: "filled",
    },
    {
        buttonTitle: "Test",
        disableWhenNoCards: true,
        icon: "thunderbolt",
        page: Page.Test,
        requiresDeckSelected: true,
        theme: "filled",
    },
    {
        buttonTitle: "Share",
        disableWhenNoCards: true,
        icon: "export",
        page: Page.Share,
        requiresDeckSelected: true,
        theme: undefined,
    },
];

class SideNav extends React.Component<SideNavProps, {}> {
    constructor(props: SideNavProps) {
        super(props);
        this.state = {};
        this.navigate = this.navigate.bind(this);
    }

    public navigate(page: Page, disabled: boolean, hidden: boolean): () => void {
        return disabled || hidden ? noop : () => {
            this.props.setPage(page);
        };
    }

    public render() {
        const { className, disableDeckActions, showDeckActions } = this.props;
        return (
            <div className={classNames(styles.container, className)}>
                {PAGES.map((page: PageLink) => {
                    const disabled = page.disableWhenNoCards && disableDeckActions;
                    const hidden = page.requiresDeckSelected && !showDeckActions;
                    const content = this.getButtonContent(page, disabled, hidden);

                    if (disabled) {
                        return (
                            <Tooltip
                                trigger="click"
                                placement="right"
                                title="Selected deck has no cards"
                                key={page.buttonTitle}
                            >
                                {content}
                            </Tooltip>
                        );
                    }
                    return content;
                })}
            </div>
        );
    }

    private getButtonContent = (page: PageLink, disabled: boolean, hidden: boolean) => {
        const { currentPage } = this.props;

        return (
            <div
                className={classNames(
                    styles.sideNavLink, {[styles.active]: page.page === currentPage},
                    {[styles.hidden]: hidden, [styles.disabled]: disabled})}
                key={page.buttonTitle}
                onClick={this.navigate(page.page, disabled, hidden)}
            >
                <Icon className={styles.icon} type={page.icon} theme={page.theme}/>
                <div className={styles.title}>{page.buttonTitle}</div>
            </div>
        );
    }
}

export default SideNav;
