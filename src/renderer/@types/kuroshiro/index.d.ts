declare module "kuroshiro" {
    class Kuroshiro {
        public static Util: KuroshiroUtil;
        constructor();
        public convert(thing: string): Promise<string>;
    }
    // tslint:disable-next-line
    class KuroshiroUtil {
        public static IsHiragana(input: string): boolean;
        public static IsKatakana(input: string): boolean;
        public static isKana(input: string): boolean;
        public static isKanji(input: string): boolean;
        public static isJapanese(input: string): boolean;
        public static hasHiragana(input: string): boolean;
        public static hasKatakana(input: string): boolean;
        public static hasKana(input: string): boolean;
        public static hasKanji(input: string): boolean;
        public static kanaToHiragna(input: string): string;
        public static kanaToKatakana(input: string): string;
        public static kanaToRomaji(input: string): string;
    }
    export = Kuroshiro;
}
