import { Input } from "antd";
import * as classNames from "classnames";
import { ChangeEvent } from "react";
import * as React from "react";

const styles = require("./style.css");

interface LineInputProps {
    className?: string;
    label?: string;
    placeholder?: string;
    value?: string;
    onBlur: (event: ChangeEvent<HTMLInputElement>) => void;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onPressEnter?: () => void;
}

class LineInput extends React.Component<LineInputProps, {}> {
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
            onChange,
            onPressEnter,
            placeholder,
            value,
        } = this.props;

        return (
            <div className={classNames(className, styles.container)}>
                <Input
                    placeholder={placeholder || ""}
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    onPressEnter={onPressEnter}
                    className={className}
                    ref={(input) => { this.input = input || undefined; }}
                />
                <div className={styles.label}>{label && label.toUpperCase()}</div>
            </div>
        );
    }
}

export default LineInput;
