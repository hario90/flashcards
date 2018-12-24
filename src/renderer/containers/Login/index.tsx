import { Button, Icon, Input } from "antd";
import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import { setPage } from "../../state/page/actions";
import { Page, SetPageAction } from "../../state/page/types";
import {
    State,
} from "../../state/types";
import { login } from "../../state/user/actions";
import { LoginAction } from "../../state/user/types";

const styles = require("./style.css");

interface LoginProps {
    className?: string;
    login: (email: string, password: string) => LoginAction;
    setPage: (page: Page) => SetPageAction;
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
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({[keyOnState]: event.target.value || ""});
        };
    }

    public canLogin = () => {
        const { email, password } = this.state;
        return !!email && !!password;
    }

    public login = () => {
        const { email, password } = this.state;
        if (email && password) {
            this.props.login(email, password);
        }
    }

    public signUp = () => {
        this.props.setPage(Page.SignUp);
    }

    public forgotPassword = () => {
        this.props.setPage(Page.ForgotPassword);
    }

    public render() {
        const { className } = this.props;
        return (
            <div className={classNames(styles.container, className)}>
                <Input
                    prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
                    type="email"
                    onChange={this.updateData("email")}
                    onPressEnter={this.login}
                    placeholder="Email"
                    className={styles.input}
                />
                <Input
                    prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
                    type="password"
                    onChange={this.updateData("password")}
                    onPressEnter={this.login}
                    placeholder="Password"
                    className={styles.input}
                />
                <Button
                    type="primary"
                    className={styles.button}
                    disabled={!this.canLogin()}
                    onClick={this.login}
                >
                    Login
                </Button>
                <div className={styles.linkContainer}>
                    <a onClick={this.forgotPassword} className={styles.link}>Forgot Password?</a>
                    <a onClick={this.signUp} className={styles.link}>Sign Up</a>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {

    };
}

const dispatchToPropsMap = {
    login,
    setPage,
};

export default connect(mapStateToProps, dispatchToPropsMap)(Login);
