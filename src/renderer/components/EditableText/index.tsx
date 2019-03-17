import { Icon, Input } from "antd";
import * as classNames from "classnames";
import { ChangeEvent } from "react";
import * as React from "react";

import EmailInput from "../EmailInput/index";
import LineInput from "../LineInput/index";

const styles = require("./style.pcss");

interface EditableTextProps {
    className?: string;
    type?: "text" | "email";
    value: string;
    onBlur: (value: string) => void;
    placeholder?: string;
    alwaysShowEditIcon?: boolean;
    onIsValidChange?: (isValid: boolean) => void;
}

interface EditableTextState {
    isEditing: boolean;
    isValid: boolean;
    newValue: string;
}

class EditableText extends React.Component<EditableTextProps, EditableTextState> {
    public static defaultProps = {
        type: "text",
    };

    public input?: Input;

    constructor(props: EditableTextProps) {
        super(props);
        const isValid = props.type === "text" ? true : EmailInput.isEmailValid(props.value);
        this.state = {
            isEditing: false,
            isValid,
            newValue: props.value,
        };
    }

    public render() {
        const {
            alwaysShowEditIcon,
            className,
            placeholder,
            type,
        } = this.props;
        const { isEditing, newValue } = this.state;

        if (!isEditing) {
            return (
                <div className={classNames(styles.readOnly, className)} onClick={this.setIsEditing(true)}>
                    <span>{newValue}</span>
                    <Icon
                        className={classNames(styles.editIcon, {[styles.alwaysShow]: alwaysShowEditIcon})}
                        type="edit"
                    />
                </div>
            );
        }

        if (type === "email") {
            return (
                <EmailInput
                    value={newValue}
                    onChange={this.updateValue}
                    ref={(i) => { this.input = i ? i.input : undefined; }}
                    onBlur={this.setIsEditing(false)}
                    useDirtyCheck={false}
                    onIsEmailValidChange={this.setIsValid}
                />
            );
        }

        return (
            <LineInput
                placeholder={placeholder}
                onChange={this.updateValue}
                value={newValue}
                ref={(i) => { this.input = i ? i.input : undefined; }}
                onBlur={this.setIsEditing(false)}
            />
        );
    }

    private updateValue = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ newValue: event.target.value });
    }

    private setIsEditing = (isEditing: boolean): () => void  => {
        return () => {
            if (!this.state.newValue && !isEditing) {
                return;
            }
            this.setState({isEditing});

            if (!isEditing) {
                this.props.onBlur(this.state.newValue);
            }
        };
    }

    private setIsValid = (isValid: boolean) => {
        this.setState({isValid});
        if (this.props.onIsValidChange) {
            this.props.onIsValidChange(isValid);
        }
    }
}

export default EditableText;
