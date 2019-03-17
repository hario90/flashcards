import { Input } from "antd";
import * as classNames from "classnames";
import { noop } from "lodash";
import { ChangeEvent } from "react";
import * as React from "react";

const styles = require("./style.pcss");

interface LineInputProps {
    className?: string;
    label?: string;
    placeholder?: string;
    type?: "text" | "email" | "password";
    value?: string;
    onBlur?: (event: ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (event: ChangeEvent<HTMLInputElement>) => void;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onPressEnter?: () => void;
}

class LineInput extends React.Component<LineInputProps, {}> {
    public static defaultProps: LineInputProps = {
        onChange: noop,
        type: "text",
    };
    public input?: Input;

    constructor(props: LineInputProps) {
        super(props);
        this.state = {};
    }

    public componentDidMount(): void {
        if (this.input) {
            this.input.focus();
        }
    }

    public render() {
        const {
            className,
            label,
            onBlur,
            onFocus,
            onChange,
            onPressEnter,
            placeholder,
            type,
            value,
        } = this.props;

        return (
            <div className={classNames(className, styles.container)}>
                <Input
                    placeholder={placeholder || ""}
                    type={type}
                    value={value}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onChange={onChange}
                    onPressEnter={onPressEnter}
                    className={classNames(className, "mousetrap")}
                    ref={(input) => { this.input = input || undefined; }}
                />
                <div className={styles.label}>{label && label.toUpperCase()}</div>
            </div>
        );
    }
}

export default LineInput;
