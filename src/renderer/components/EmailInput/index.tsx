import { Icon, Input } from "antd";
import * as classNames from "classnames";
import { isEmpty } from "lodash";
import * as React from "react";

const styles = require("./style.css");

interface EmailInputProps {
    className?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onPressEnter?: () => void;
    onBlur?: () => void;
    onIsEmailValidChange?: (isValid: boolean) => void;
    useDirtyCheck?: boolean;
    value?: string;
}

interface EmailInputState {
    error?: string;
    isDirty: boolean;
    value: string;
}

class EmailInput extends React.Component<EmailInputProps, EmailInputState> {
    public static isEmailValid = (email: string): boolean => {
        const regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        return email === "" || !isEmpty(email.match(regex));
    }

    private static defaultProps = {
        useDirtyCheck: true,
    };

    public input?: Input;

    constructor(props: EmailInputProps) {
        super(props);
        this.state = {
            isDirty: false,
            value: props.value || "",
        };
    }

    public componentDidMount(): void {
        if (this.input) {
            this.input.focus();
        }
    }

    public onBlur = () => {
        this.setState({isDirty: true});

        if (this.props.onBlur) {
            this.props.onBlur();
        }
    }

    public onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { onChange, onIsEmailValidChange } = this.props;
        const showError = !!event.target.value && !EmailInput.isEmailValid(event.target.value);
        this.setState({error: showError ? "Not a valid email" : undefined, value: event.target.value});

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
        const { className, useDirtyCheck } = this.props;
        const { error, isDirty, value } = this.state;
        return (
            <div className={classNames(styles.container, className)}>
                <Input
                    prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
                    type="email"
                    onChange={this.onChange}
                    onPressEnter={this.onPressEnter}
                    placeholder="Email"
                    onBlur={this.onBlur}
                    className={classNames(styles.input, {[styles.error]: !!error && isDirty})}
                    ref={(input) => { this.input = input || undefined; }}
                    value={value}
                />
                {error && (!useDirtyCheck || isDirty) && <div className={styles.error}>{error}</div>}
            </div>
        );
    }
}

export default EmailInput;
