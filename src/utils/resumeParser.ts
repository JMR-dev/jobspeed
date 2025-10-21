import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import type { ResumeData } from '../types';
import { sectionizeResume } from '../parsers/sectionizer';
import { parsePersonalInfo } from '../parsers/personalInfoParser';
import { parseWorkExperience } from '../parsers/workExperienceParser';

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

// --- Helper Parsers for Education, Summary, and Skills ---

/** Parses education section */
function parseEducation(lines: string[]): ResumeData['education'] {
  if (lines.length === 0) return [];

  // Heuristic: First line is Institution, Second is Degree/Field, Third is date
  const institution = lines[0]?.trim();
  let degree = '';
  let graduationDate = '';

  if (lines.length > 1 && lines[1]) {
    degree = lines[1].trim();
  }

  if (lines.length > 2 && lines[2]) {
    // Look for the date on the third line (or just a year)
    const yearMatch = lines[2].match(/\d{4}/);
    if (yearMatch && yearMatch[0]) {
      graduationDate = yearMatch[0];
    }
  }

  if (institution) {
    return [{
      institution,
      degree: degree || 'N/A',
      field: undefined,
      graduationDate: graduationDate || 'N/A',
      gpa: undefined
    }];
  }
  return [];
}

/** Parses the summary section */
function parseSummary(lines: string[]): string | undefined {
  return lines.join(' ').trim() || undefined;
}

/** Parses the skills section */
function parseSkills(lines: string[]): string[] {
  // Assume skills are separated by commas, semicolons, or pipes
  const text = lines.join(', ');
  return text.split(/[,;|\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
}

// --- Main Text Parsing Function ---

/**
 * Parses resume text to extract structured data using a multi-pass heuristic.
 */
function parseResumeText(rawText: string): ResumeData {
  // 1. SECTIONING: Split into chunks
  const sections = sectionizeResume(rawText);

  // 2. PARSING: Extract data from each section (with fallback to empty arrays)
  const personalInfo = parsePersonalInfo(sections.header || []);
  const workExperience = parseWorkExperience(sections.workExperience || []);
  const education = parseEducation(sections.education || []);
  const skills = parseSkills(sections.skills || []);
  const summary = parseSummary(sections.summary || []);

  // 3. SORTING: Sort by recency (most recent first)
  workExperience.sort((a, b) => {
    // If one is 'present', it goes first
    if (a.current && !b.current) return -1;
    if (!a.current && b.current) return 1;

    // Convert date string to Date object for comparison
    const dateA = new Date(a.endDate.toLowerCase() === 'present' ? '2999' : a.endDate);
    const dateB = new Date(b.endDate.toLowerCase() === 'present' ? '2999' : b.endDate);

    // Sort descending (most recent first)
    return dateB.getTime() - dateA.getTime();
  });

  return {
    personalInfo,
    workExperience,
    education,
    certifications: [], // Placeholder
    skills,
    summary,
  };
}

/**
 * Main function to parse a resume file (PDF, DOCX, or TXT)
 */
export async function parseResumeFile(file: File): Promise<ResumeData> {
  let text = '';
  const mimeType = file.type;

  if (mimeType === 'application/pdf') {
    text = await extractTextFromPDF(file);
  } else if (
    mimeType ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    text = await extractTextFromDOCX(file);
  } else if (mimeType === 'text/plain') {
    text = await file.text();
  } else {
    throw new Error('Unsupported file type. Only PDF, DOCX, and TXT files are supported.');
  }

  // Pre-process text: clean up extra spaces and non-standard newlines
  const cleanedText = text.replace(/(\r\n|\n\r|\r)/g, '\n').replace(/\n\s*\n/g, '\n\n');

  return parseResumeText(cleanedText);
}
