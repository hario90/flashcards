import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import {
    State,
} from "../../state/types";

const styles = require("./style.css");

interface MatchProps {
    className?: string;
}

class Match extends React.Component<MatchProps, {}> {
    constructor(props: MatchProps) {
        super(props);
        this.state = {};
    }

    public render() {
        const { className } = this.props;
        return (
            <div className={classNames(className, styles.container)}>
                Match
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {};
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(Match);
