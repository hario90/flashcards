import { Button, Icon, Input } from "antd";
import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import EmailInput from "../../components/EmailInput/index";
import { setPage } from "../../state/page/actions";
import { Page, SetPageAction } from "../../state/page/types";

import {
    State,
} from "../../state/types";
import { signup } from "../../state/user/actions";
import { SignupAction } from "../../state/user/types";

const styles = require("./style.css");

interface PasswordRequirement {
    requirement: string;
    validate: (pw: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
    {
        requirement: "8 characters long",
        validate: (pw: string) => pw.length >= 8,
    },
    {
        requirement: "At least one lowercase letter",
        validate: (pw: string) => /[a-z]/.test(pw),
    },
    {
        requirement: "At least one uppercase letter",
        validate: (pw: string) => /[A-Z]/.test(pw),
    },
    {
        requirement: "At least one number",
        validate: (pw: string) => /[0-9]/.test(pw),
    },
];

interface SignupProps {
    className?: string;
    signup: (email: string, password: string, firstName: string, lastName: string) => SignupAction;
    setPage: (page: Page) => SetPageAction;
}

interface SignupState {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    emailValid?: boolean;
    passwordValid?: boolean;
}

class Signup extends React.Component<SignupProps, SignupState> {
    constructor(props: SignupProps) {
        super(props);
        this.state = {
            emailValid: false,
            passwordValid: false,
        };
    }

    public updateData = (keyOnState: keyof SignupState) => {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({[keyOnState]: event.target.value || ""});
        };
    }

    public updatePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        let passwordValid = true;
        if (event.target.value) {
            const results: boolean[] = passwordRequirements.map((r) => {
                return r.validate(event.target.value || "");
            });
            passwordValid = results.filter((r) => !r).length === 0;
        }

        this.setState({passwordValid, password: event.target.value || "" });
    }

    public canSignup = () => {
        const { email, emailValid, password, passwordValid } = this.state;
        return !!email && !!password && emailValid && passwordValid;
    }

    public signup = () => {
        const { email, password, firstName, lastName } = this.state;
        if (email && password && firstName && lastName) {
            this.props.signup(email, password, firstName, lastName);
        }
    }

    public login = () => {
        this.props.setPage(Page.Login);
    }

    public updateIsEmailValid = (isValid: boolean) => {
        this.setState({emailValid: isValid});
    }

    public getPasswordRequirements = () => {
        const { password } = this.state;
        if (password) {
            return passwordRequirements.map((requirement) => {
                const passed = requirement.validate(password);
                return (
                    <div
                        key={requirement.requirement}
                        className={classNames(styles.requirement, {[styles.missed]: !passed})}
                    >
                        <Icon type={passed ? "check-circle" : "close-circle"} className={styles.icon}/>
                        {requirement.requirement}
                    </div>
                );
            });
        }

        return null;
    }

    public render() {
        const { className } = this.props;
        return (
            <div className={classNames(styles.container, className)}>
                <div className={styles.form}>
                    <EmailInput
                        onChange={this.updateData("email")}
                        onPressEnter={this.signup}
                        className={styles.input}
                        onIsEmailValidChange={this.updateIsEmailValid}
                    />
                    <div className={styles.formElement}>
                        <Input
                            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
                            type="password"
                            onChange={this.updatePassword}
                            onPressEnter={this.signup}
                            placeholder="Password"
                            className={styles.input}
                        />
                        <div className={styles.passwordRequirements}>
                            {this.getPasswordRequirements()}
                        </div>
                    </div>
                    <Input
                        className={styles.input}
                        onPressEnter={this.signup}
                        placeholder="First Name"
                        onChange={this.updateData("firstName")}
                    />
                    <Input
                        className={styles.input}
                        onPressEnter={this.signup}
                        placeholder="Last Name"
                        onChange={this.updateData("lastName")}
                    />
                    <Button
                        type="primary"
                        className={styles.button}
                        disabled={!this.canSignup()}
                        onClick={this.signup}
                    >
                        Sign Up
                    </Button>
                    <div className={styles.linkContainer}>
                        <a onClick={this.login} className={styles.link}>Already have an account? Login</a>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {};
}

const dispatchToPropsMap = {
    setPage,
    signup,
};

export default connect(mapStateToProps, dispatchToPropsMap)(Signup);
