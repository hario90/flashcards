import { Button, Icon, Input } from "antd";
import * as classNames from "classnames";
import { ChangeEvent } from "react";
import * as React from "react";
import { connect } from "react-redux";
import LineInput from "../../components/LineInput/index";

import {
    State,
} from "../../state/types";

const styles = require("./style.css");

interface LoginProps {
    className?: string;
}

interface LoginState {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}

class Login extends React.Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);
        this.state = {};
    }

    public updateData = (keyOnState: keyof LoginState) => {
        return (event: ChangeEvent<HTMLInputElement>) => {
            this.setState({[keyOnState]: event.target.value || ""});
        };
    }

    public canLogin = () => {
        const { email, password } = this.state;
        return !!email && !!password;
    }

    public render() {
        const { className } = this.props;
        return (
            <div className={classNames(styles.container, className)}>
                <Input
                    prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
                    type="email"
                    onBlur={this.updateData("email")}
                    placeholder="Email"
                    className={styles.input}
                />
                <Input
                    prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
                    type="password"
                    onBlur={this.updateData("password")}
                    placeholder="Password"
                    className={styles.input}
                />
                <Button
                    type="primary"
                    className={styles.button}
                    disabled={!this.canLogin()}
                >
                    Login
                </Button>
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {};
}

const dispatchToPropsMap = {};

export default connect(mapStateToProps, dispatchToPropsMap)(Login);
