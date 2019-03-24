declare module "kuroshiro" {
    class Kuroshiro {
        public static Util: {
            IsHiragana(input: string): boolean;
            IsKatakana(input: string): boolean;
            isKana(input: string): boolean;
            isKanji(input: string): boolean;
            isJapanese(input: string): boolean;
            hasHiragana(input: string): boolean;
            hasKatakana(input: string): boolean;
            hasKana(input: string): boolean;
            hasKanji(input: string): boolean;
            kanaToHiragna(input: string): string;
            kanaToKatakana(input: string): string;
            kanaToRomaji(input: string): string;
        };

        constructor();

        /**
         * Initialize Kuroshiro
         * @memberOf Kuroshiro
         * @instance
         * @returns {Promise} Promise object represents the result of initialization
         */
        public init(analyzer: any): Promise<void>;

        /**
         * Convert given string to target syllabary with options available
         * @memberOf Kuroshiro
         * @instance
         * @param {string} str Given String
         * @param {Object} [options] Settings Object
         * @param {string} [options.to="hiragana"] Target syllabary ["hiragana"|"katakana"|"romaji"]
         * @param {string} [options.mode="normal"] Convert mode ["normal"|"spaced"|"okurigana"|"furigana"]
         * @param {string} [options.romajiSystem="hepburn"] Romanization System ["nippon"|"passport"|"hepburn"]
         * @param {string} [options.delimiter_start="("] Delimiter(Start)
         * @param {string} [options.delimiter_end=")"] Delimiter(End)
         * @returns {Promise} Promise object represents the result of conversion
         */

        public convert(str: string, options: {
            to?: "hiragana" | "katakana" | "romaji";
            mode?: "normal" | "spaced" | "okurigana" | "furigana";
            romajiSystem?: "nippon" | "passport" | "hepburn";
            delimiter_start?: string;
            delimiter_end?: string;
        }): Promise<string>;
    }
    export = Kuroshiro;
}
