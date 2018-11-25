import * as classNames from "classnames";
import * as React from "react";

import { Page, SetPageAction } from "../../state/page/types";

const styles = require("./style.css");

interface SideNavProps {
    className?: string;
    setPage: (page: Page) => SetPageAction;
}

const PAGES = [
    {buttonTitle: "EDIT", page: Page.CreateDeck},
    {buttonTitle: "FLIP", page: Page.Flip},
    {buttonTitle: "COPY", page: Page.Copy},
    {buttonTitle: "TEST", page: Page.Test},
    {buttonTitle: "SHARE", page: Page.Share},
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
        const { className } = this.props;
        return (
            <div className={classNames(styles.container, className)}>
                {PAGES.map((page) => (
                    <div
                        className={styles.sideNavLink}
                        key={page.buttonTitle}
                        onClick={this.navigate(page.page)}
                    >
                        {page.buttonTitle}
                    </div>
                ))}
            </div>
        );
    }
}

export default SideNav;
