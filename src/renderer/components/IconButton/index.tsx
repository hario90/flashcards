import { Button, Icon } from "antd";
import * as classNames from "classnames";
import * as React from "react";

const styles = require("./style.css");

interface IconButtonProps {
    className?: string;
    title: string;
    onClick: (event: any) => void;
    icon: string;
    twoToneColor?: string;
    color?: string;
    backgroundColor?: string;
}

const IconButton: React.SFC<IconButtonProps> = ({title, onClick, icon, className, twoToneColor, color = "black",
                                                    backgroundColor = "white"}: IconButtonProps) => {
    const style = {fontSize: 24, color: twoToneColor || color};
    let buttonIcon = <Icon type={icon} style={style}/>;
    if (twoToneColor) {
        buttonIcon = <Icon type={icon} theme="twoTone" twoToneColor={twoToneColor} style={style}/>;
    }

    return (
        <Button
            onClick={onClick}
            className={classNames(styles.container, className)}
            style={{backgroundColor}}
            size="large"
        >
            {buttonIcon}
            <div style={{color: twoToneColor || color}}>{title}</div>
        </Button>
    );
};

export default IconButton;
