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
        public convert(thing: string): Promise<string>;
    }
    export = Kuroshiro;
}
