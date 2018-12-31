import { Icon } from "antd";
import * as classNames from "classnames";
import { noop } from "lodash";
import * as React from "react";

import { Page, SetPageAction } from "../../state/page/types";

const styles = require("./style.css");

interface SideNavProps {
    className?: string;
    disableDeckActions: boolean;
    setPage: (page: Page) => SetPageAction;
    currentPage: Page;
}

interface PageLink {
    buttonTitle: string;
    icon: string;
    page: Page;
    theme: "filled" | "twoTone" | "outlined" | undefined;
    requiresDeckSelected: boolean;
}

const PAGES: PageLink[] = [
    {
        buttonTitle: "Decks",
        icon: "appstore",
        page: Page.Home,
        requiresDeckSelected: false,
        theme: "filled",
    },
    {
        buttonTitle: "Edit",
        icon: "edit",
        page: Page.CreateDeck,
        requiresDeckSelected: true,
        theme: "filled",
    },
    {
        buttonTitle: "Flip",
        icon: "sync",
        page: Page.Flip,
        requiresDeckSelected: true,
        theme: undefined,
    },
    {
        buttonTitle: "Match",
        icon: "copy",
        page: Page.Match,
        requiresDeckSelected: true,
        theme: "filled",
    },
    {
        buttonTitle: "Test",
        icon: "thunderbolt",
        page: Page.Test,
        requiresDeckSelected: true,
        theme: "filled",
    },
    {
        buttonTitle: "Share",
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

    public navigate(page: Page, disabled: boolean): () => void {
        return disabled ? noop : () => {
            this.props.setPage(page);
        };
    }

    public render() {
        const { className, currentPage, disableDeckActions } = this.props;
        return (
            <div className={classNames(styles.container, className)}>
                {PAGES.map((page: PageLink) => {
                    const disabled = page.requiresDeckSelected && disableDeckActions;

                    return (
                        <div
                            className={classNames(
                                styles.sideNavLink, {[styles.active]: page.page === currentPage},
                                {[styles.disabled]: disabled})}
                            key={page.buttonTitle}
                            onClick={this.navigate(page.page, disabled)}
                        >
                            <Icon className={styles.icon} type={page.icon} theme={page.theme}/>
                            <div className={styles.title}>{page.buttonTitle}</div>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default SideNav;
