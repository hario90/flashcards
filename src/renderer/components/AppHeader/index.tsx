import { Button, Icon } from "antd";
import * as classNames from "classnames";
import * as React from "react";

import { GoBackAction, Page } from "../../state/page/types";

const styles = require("./style.css");

interface AppHeaderProps {
    className?: string;
    goBack: () => GoBackAction;
    previousPage: Page;
    previousTitle: string;
    title: string;
}

class AppHeader extends React.Component<AppHeaderProps, {}> {
    constructor(props: AppHeaderProps) {
        super(props);
        this.state = {};
        this.goBack = this.goBack.bind(this);
    }

    public render() {
        const {
            className,
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
                    <Icon type="left" />
                    {`Back to ${previousTitle}`}
                </Button> : <div className={styles.spacer}/>
                }
                <h1>{title}</h1>
                <Button className={styles.user} shape="circle" ghost={true} icon="user"/>
            </div>
        );
    }

    public goBack(): void {
        this.props.goBack();
    }
}

export default AppHeader;
