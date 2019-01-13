import { Icon, Input } from "antd";
import * as classNames from "classnames";
import * as React from "react";

const styles = require("./style.css");

interface EmailInputProps {
    className?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onPressEnter?: () => void;
    onIsEmailValidChange?: (isValid: boolean) => void;
}

interface EmailInputState {
    error?: string;
    isDirty: boolean;
}

class EmailInput extends React.Component<EmailInputProps, EmailInputState> {
    constructor(props: EmailInputProps) {
        super(props);
        this.state = {
            isDirty: false,
        };
    }

    public isEmailValid = (email: string) => {
        const regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        return email === "" || email.match(regex);
    }

    public setDirty = () => {
        this.setState({isDirty: true});
    }

    public onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { onChange, onIsEmailValidChange } = this.props;
        const showError = !!event.target.value && !this.isEmailValid(event.target.value);
        this.setState({error: showError ? "Not a valid email" : undefined});

        if (onChange) {
            onChange(event);
        }

        if (onIsEmailValidChange) {
            onIsEmailValidChange(!showError);
        }
    }

    public onPressEnter = () => {
        const { onPressEnter } = this.props;
        if (onPressEnter) {
            onPressEnter();
        }
    }

    public render() {
        const { className } = this.props;
        const { error, isDirty } = this.state;
        return (
            <div className={classNames(styles.container, className)}>
                <Input
                    prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
                    type="email"
                    onChange={this.onChange}
                    onPressEnter={this.onPressEnter}
                    placeholder="Email"
                    onBlur={this.setDirty}
                    className={classNames(styles.input, {[styles.error]: !!error && isDirty})}
                />
                {error && isDirty && <div className={styles.error}>{error}</div>}
            </div>
        );
    }
}

export default EmailInput;