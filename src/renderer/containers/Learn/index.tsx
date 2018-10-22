import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import {
    State,
} from "../../state/types";

const styles = require("./style.css");

interface LearnProps {
    className?: string;
}

class Learn extends React.Component<LearnProps, {}> {
    constructor(props: LearnProps) {
        super(props);
        this.state = {};
    }

    public render() {
        const { className } = this.props;
        return (
            <div className={classNames(className, styles.container)}>
                Learn
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {};
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(Learn);
