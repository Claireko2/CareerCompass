declare module 'pdf-parse' {
    interface PdfParseOptions {
        max?: number;
        version?: string;
        pagerender?: (pageData: any) => Promise<string> | string;
    }

    interface PdfParseResult {
        numpages: number;
        numrender: number;
        info: any;
        metadata: any;
        text: string;
        version: string;
    }

    function pdfParse(dataBuffer: Buffer | Uint8Array, options?: PdfParseOptions): Promise<PdfParseResult>;

    export default pdfParse;
}
