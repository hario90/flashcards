import * as classNames from "classnames";
import * as React from "react";

const styles = require("./style.pcss");

interface ShortcutHintProps {
    hint: string;
    visible: boolean;
}

const ShortcutHint: React.FunctionComponent<ShortcutHintProps> = ({hint, visible}) => {
    return (
        <div className={classNames(styles.shortcutHint, {[styles.visible]: visible})}>{hint}</div>
    );
};

export default ShortcutHint;
