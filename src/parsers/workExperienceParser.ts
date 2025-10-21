import type { ResumeData } from '../types';

// Regex for common date formats: MM/YYYY - MM/YYYY or YYYY - YYYY or Present
const DATE_RANGE_REGEX =
  /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\d{4}|\d{4}|\d{1,2}\/\d{4})\s*-\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\d{4}|\d{4}|present)/i;

/**
 * Parses work experience using date ranges as anchors for job entry segmentation.
 */
export function parseWorkExperience(lines: string[]): ResumeData['workExperience'] {
  const experience: ResumeData['workExperience'] = [];
  let currentJob: ResumeData['workExperience'][0] | null = null;
  const descriptionLines: string[] = [];

  const flushCurrentJob = () => {
    if (currentJob) {
      currentJob.description = descriptionLines.join('\n').trim();
      experience.push(currentJob);
    }
    currentJob = null;
    descriptionLines.length = 0; // Clear the array
  };

  for (const line of lines) {
    const dateMatch = line.match(DATE_RANGE_REGEX);

    if (dateMatch && dateMatch[1] && dateMatch[2]) {
      // 1. Found a new job entry (date-anchor)
      flushCurrentJob(); // Save the previous job

      const start = dateMatch[1];
      const end = dateMatch[2];
      const dateLineIndex = line.indexOf(dateMatch[0]);

      // Heuristic: Position is before the date; Company is usually the line before that
      let position = line.substring(0, dateLineIndex).trim();
      let company = '';

      // Try to find the company from the previous description lines (or header if it's the first one)
      if (lines.indexOf(line) > 0 && descriptionLines.length > 0) {
        company = descriptionLines.pop()?.trim() ?? '';
      }

      // If the line *after* company is too short, assume it was part of the position/company line
      // Example: 'Sr. Software Engineer | 01/2020 - 01/2023' (Company is missing/previous line)
      if (company === '') {
        const lineIndex = lines.indexOf(line);
        if (lineIndex > 0) {
          const precedingLine = lines[lineIndex - 1]?.trim() ?? '';
          if (precedingLine.length > 0 && !DATE_RANGE_REGEX.test(precedingLine)) {
            company = precedingLine;
          }
        }
      }

      // Final cleanup of position line if it contained the company
      if (position.includes('|')) {
        const splitPosition = position.split('|')[0];
        position = splitPosition ? splitPosition.trim() : position;
      }

      currentJob = {
        company: company,
        position: position.trim(),
        startDate: start.trim(),
        endDate: end.trim(),
        description: '', // Will be filled in the next pass
        current: end.toLowerCase() === 'present',
      };
    } else if (currentJob) {
      // 2. Add bullet points/description to the current job
      descriptionLines.push(line);
    }
  }

  // Flush the final job entry
  flushCurrentJob();

  // The very first entry in the lines array might be the first company/title if no date anchor
  // is present on the company/title line itself.
  if (experience.length === 0 && lines.length > 0) {
    // Emergency attempt to find at least one entry if the date regex failed everywhere
    return parseWorkExperienceFallback(lines);
  }

  return experience;
}

/** Fallback parser if date regex fails completely */
function parseWorkExperienceFallback(lines: string[]): ResumeData['workExperience'] {
  // This is a minimal fallback and will be less accurate
  if (lines.length < 3) return [];

  const line0 = lines[0];
  const line1 = lines[1];
  if (!line0 || !line1) return [];

  // Crude assumption: First line is Company, Second is Position/Dates, Third+ is description
  const dateMatch = line1.match(DATE_RANGE_REGEX);
  if (!dateMatch || !dateMatch[0] || !dateMatch[1] || !dateMatch[2]) return [];

  const start = dateMatch[1];
  const end = dateMatch[2];
  const position = line1.substring(0, line1.indexOf(dateMatch[0])).trim();

  return [{
    company: line0.trim(),
    position: position || 'N/A',
    startDate: start.trim(),
    endDate: end.trim(),
    description: lines.slice(2).join('\n').trim(),
    current: end.toLowerCase() === 'present',
  }];
}
