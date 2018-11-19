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
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onPressEnter?: () => void;
}

class LineInput extends React.Component<LineInputProps, {}> {
    constructor(props: LineInputProps) {
        super(props);
        this.state = {};
    }

    public render() {
        const {
            className,
            label,
            onChange,
            onPressEnter,
            value,
        } = this.props;

        return (
            <div className={classNames(className, styles.container)}>
                <Input
                    placeholder="Deck Name"
                    value={value}
                    onChange={onChange}
                    onPressEnter={onPressEnter}
                    className={className}
                />
                <div className={styles.label}>{label && label.toUpperCase()}</div>
            </div>
        );
    }
}

export default LineInput;
