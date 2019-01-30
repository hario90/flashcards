import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import {
    State,
} from "../../state/types";

const styles = require("./style.css");

interface ProfileProps {
    className?: string;
}

class Profile extends React.Component<ProfileProps, {}> {
    constructor(props: ProfileProps) {
        super(props);
        this.state = {};
    }

    public render() {
        const { className } = this.props;
        return (
            <div className={classNames(styles.container, className)}>
                Profile
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {};
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(Profile);
