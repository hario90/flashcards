import { Icon, Input } from "antd";
import * as classNames from "classnames";
import { ChangeEvent } from "react";
import * as React from "react";

import EmailInput from "../EmailInput/index";
import LineInput from "../LineInput/index";

const styles = require("./style.css");

interface EditableTextProps {
    className?: string;
    type?: "text" | "email";
    value: string;
    onBlur: (value: string) => void;
    placeholder?: string;
    alwaysShowEditIcon?: boolean;
}

interface EditableTextState {
    isEditing: boolean;
    newValue: string;
}

class EditableText extends React.Component<EditableTextProps, EditableTextState> {
    private static defaultProps = {
        type: "text",
    };

    private input?: Input;

    constructor(props: EditableTextProps) {
        super(props);
        this.state = {
            isEditing: false,
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
                    onChange={this.updateValue}
                    ref={(i) => { this.input = i ? i.input : undefined; }}
                    onBlur={this.setIsEditing(false)}
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
}

export default EditableText;
