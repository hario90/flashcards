import { Select } from "antd";
import * as classNames from "classnames";
import * as React from "react";
import { TranslateMode, TranslateTarget } from "../../state/deck/types";

const styles = require("./style.pcss");

interface JapaneseOptionsProps {
    className?: string;
    mode: TranslateMode;
    setTranslateTarget: (value: TranslateTarget) => void;
    setMode: (value: TranslateMode) => void;
    translateTarget: TranslateTarget;
}

class JapaneseOptions extends React.Component<JapaneseOptionsProps> {
    public render() {
        const { className, mode, translateTarget } = this.props;
        return (
            <div className={classNames(styles.container, className)}>
                <div className={styles.formGroup}>
                    <span className={styles.label}>Translate Kanji to:&nbsp;</span>
                    <Select onChange={this.props.setTranslateTarget} value={translateTarget}>
                        <Select.Option value="hiragana">Hiragana</Select.Option>
                        <Select.Option value="katakana">Katakana</Select.Option>
                        <Select.Option value="romaji">Romaji</Select.Option>
                    </Select>
                </div>

                <div className={styles.formGroup}>
                    <span className={styles.label}>Translate Mode:&nbsp;</span>
                    <Select onChange={this.props.setMode} value={mode}>
                        <Select.Option value="normal">Normal</Select.Option>
                        <Select.Option value="okurigana">Okurigana</Select.Option>
                        <Select.Option value="furigana">Furigana</Select.Option>
                    </Select>
                </div>
            </div>
        );
    }
}

export default JapaneseOptions;
