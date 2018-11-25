import { Icon } from "antd";
import * as classNames from "classnames";
import * as React from "react";

import { Page, SetPageAction } from "../../state/page/types";

const styles = require("./style.css");

interface SideNavProps {
    className?: string;
    setPage: (page: Page) => SetPageAction;
    currentPage: Page;
}

const PAGES = [
    {
        buttonTitle: "Edit",
        icon: "edit",
        page: Page.CreateDeck,
    },
    {
        buttonTitle: "Flip",
        icon: "sync",
        page: Page.Flip,
    },
    {
        buttonTitle: "Copy",
        icon: "copy",
        page: Page.Copy,
    },
    {
        buttonTitle: "Test",
        icon: "thunderbolt",
        page: Page.Test,
    },
    {
        buttonTitle: "Share",
        icon: "export",
        page: Page.Share,
    },
];

class SideNav extends React.Component<SideNavProps, {}> {
    constructor(props: SideNavProps) {
        super(props);
        this.state = {};
        this.navigate = this.navigate.bind(this);
    }

    public navigate(page: Page): () => void {
        return () => {
            this.props.setPage(page);
        };
    }

    public render() {
        const { className, currentPage } = this.props;
        return (
            <div className={classNames(styles.container, className)}>
                {PAGES.map((page) => {
                    return (
                        <div
                            className={classNames(styles.sideNavLink, {[styles.active]: page.page === currentPage})}
                            key={page.buttonTitle}
                            onClick={this.navigate(page.page)}
                        >
                            <Icon className={styles.icon} type={page.icon}/>
                            <div className={styles.title}>{page.buttonTitle}</div>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default SideNav;
