//src/resume/fileUtils
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

// Extract text from PDF buffer
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
    const data = await pdfParse(buffer);
    return data.text;
}

// Extract text from DOCX buffer
export async function extractTextFromDocx(buffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
}

// Fallback for plain text
export function extractTextFromTxt(buffer: Buffer): string {
    return buffer.toString('utf-8');
}
