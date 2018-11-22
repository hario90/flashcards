import { Button, Icon } from "antd";
import * as React from "react";
import { connect } from "react-redux";

import { goBack, setPage } from "../../state/page/actions";
import { previousPageMap } from "../../state/page/constants";
import { getPage, getTitle } from "../../state/page/selectors";
import {
    GoBackAction,
    Page,
} from "../../state/page/types";
import { State } from "../../state/types";
import "../../styles/fonts.css";

import CreateDeck from "../CreateDeck";
import Home from "../Home";
import Learn from "../Learn";
import Test from "../Test";

const styles = require("./style.css");

interface AppProps {
    className?: string;
    goBack: () => GoBackAction;
    page: Page;
    previousPage: Page;
    title: string;
}

const pageComponentMap: Map<Page, JSX.Element> = new Map([
    [Page.Home, <Home key={Page.Home}/>],
    [Page.CreateDeck, <CreateDeck key={Page.CreateDeck}/>],
    [Page.Test, <Test key={Page.Test}/>],
    [Page.Learn, <Learn key={Page.Learn}/>],
]);

class App extends React.Component<AppProps, {}> {
    constructor(props: AppProps) {
        super(props);
        this.goBack = this.goBack.bind(this);
    }

    public goBack(): void {
        this.props.goBack();
    }

    public render() {
        const { page, previousPage, title } = this.props;
        return (
            <div className={styles.container}>
                <div className={styles.titleContainer}>
                    {previousPage !== undefined &&
                        <Button
                            className={styles.goBack}
                            type="default"
                            onClick={this.goBack}>
                            <Icon type="left" />
                        </Button>
                    }
                    <h1>{title}</h1>
                </div>
                {pageComponentMap.get(page)}
            </div>
        );
    }
}

function mapStateToProps(state: State): Partial<AppProps> {
    return {
        page: getPage(state),
        previousPage: previousPageMap.get(getPage(state)),
        title: getTitle(state),
    };
}

const dispatchToPropsMap = {
    goBack,
    setPage,
};

export default connect(mapStateToProps, dispatchToPropsMap)(App);
