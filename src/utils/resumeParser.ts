import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import type { ResumeData } from '../types';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

/**
 * Extract text from a PDF file
 */
async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';

  // Extract text from each page
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
}

/**
 * Extract text from a DOCX file
 */
async function extractTextFromDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/**
 * Parse resume text to extract structured data
 */
function parseResumeText(text: string): ResumeData {
  const lines = text.split('\n').filter((line) => line.trim());

  return {
    personalInfo: {
      fullName:
        lines
          .find((line) => line.match(/^[A-Z][a-z]+ [A-Z][a-z]+/))
          ?.trim() || '',
      email:
        lines
          .find((line) =>
            line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
          )
          ?.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || '',
      phone:
        lines
          .find((line) =>
            line.match(/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
          )
          ?.match(/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0] || '',
      address:
        lines
          .find((line) => line.match(/\d+\s+\w+\s+(St|Ave|Rd|Blvd|Ln|Dr)/i))
          ?.trim() || '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    workExperience: [],
    education: [],
    skills: [],
    summary: '',
  };
}

/**
 * Main function to parse a resume file (PDF or DOCX)
 */
export async function parseResumeFile(file: File): Promise<ResumeData> {
  const fileName = file.name.toLowerCase();
  let text = '';

  if (fileName.endsWith('.pdf')) {
    text = await extractTextFromPDF(file);
  } else if (fileName.endsWith('.docx')) {
    text = await extractTextFromDOCX(file);
  } else {
    throw new Error('Unsupported file type. Only PDF and DOCX files are supported.');
  }

  return parseResumeText(text);
}
