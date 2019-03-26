import { Cascader } from "antd";
import { CascaderOptionType } from "antd/lib/cascader";
import * as classNames from "classnames";
import * as React from "react";

const styles = require("./style.pcss");

interface FlipOptionsProps {
    className?: string;
    back: string[];
    front: string[];
    onBackChange: (value: string[], selectedOptions?: CascaderOptionType[]) => void;
    onFrontChange: (value: string[], selectedOptions?: CascaderOptionType[]) => void;
}

const options = [
    {
        children: [
            {
                label: "Kanji",
                value: "kanji",
            },
            {
                label: "Hiragana",
                value: "hiragana",
            },
            {
                label: "Romaji",
                value: "romaji",
            },
        ],
        label: "Japanese",
        value: "japanese",
    },
    {
        label: "English",
        value: "english",
    },
];

const FlipOptions: React.FunctionComponent<FlipOptionsProps> = ({ className, front, back, onBackChange, onFrontChange }) => {
    return (
        <div className={classNames(styles.container, className)}>
            <div className={styles.group}>
                <span className={styles.label}>Front:&nbsp;</span>
                <Cascader options={options} value={front} onChange={onFrontChange}/>
            </div>
            <div className={styles.group}>
                <span className={styles.label}>Back:&nbsp;</span>
                <Cascader options={options} value={back} onChange={onBackChange}/>
            </div>
        </div>
    );
};

export default FlipOptions;
