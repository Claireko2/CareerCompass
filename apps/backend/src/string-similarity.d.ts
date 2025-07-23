declare module 'string-similarity' {
    export interface Match {
        target: string;
        rating: number;
    }

    export function compareTwoStrings(str1: string, str2: string): number;

    export function findBestMatch(
        mainString: string,
        targetStrings: string[]
    ): {
        ratings: Match[];
        bestMatch: Match;
    };
}

