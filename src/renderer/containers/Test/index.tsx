import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import {
    State,
} from "../../state/types";

const styles = require("./style.css");

interface TestProps {
    className?: string;
}

class Test extends React.Component<TestProps, {}> {
    constructor(props: TestProps) {
        super(props);
        this.state = {};
    }

    public render() {
        const { className } = this.props;
        return (
            <div className={classNames(className, styles.container)}>
                Test
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {};
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(Test);
