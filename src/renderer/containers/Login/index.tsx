import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import {
    State,
} from "../../state/types";

const styles = require("./style.css");

interface LoginProps {
    className?: string;
}

class Login extends React.Component<LoginProps, {}> {
    constructor(props: LoginProps) {
        super(props);
        this.state = {};
    }

    public render() {
        const { className } = this.props;
        return (
            <div className={classNames(styles.container, className)}>
                Login
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {};
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(Login);
