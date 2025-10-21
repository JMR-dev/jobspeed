import type { ResumeData } from '../types';

/**
 * Parses personal contact information from the resume header lines.
 */
export function parsePersonalInfo(headerLines: string[]): ResumeData['personalInfo'] {
  const text = headerLines.join(' ');
  const personalInfo: ResumeData['personalInfo'] = {
    fullName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
  };

  // 1. Email: Robust email regex
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    personalInfo.email = emailMatch[0].trim();
  }

  // 2. Phone: Common phone number formats (US/Intl)
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) {
    personalInfo.phone = phoneMatch[0].trim();
  }

  // 3. Address: City, State, and/or Zip
  // Common format: 'City, ST Zip' or 'City, State'
  const cityStateMatch = text.match(/([A-Z][a-z]+(?: [A-Z][a-z]+)?),\s*(?:[A-Z]{2}|\w+)/);
  if (cityStateMatch && cityStateMatch[1]) {
    const city = cityStateMatch[1];
    personalInfo.city = city.trim();

    // Crude State/Zip extraction near the city
    const subsequentText = text.substring(text.indexOf(city) + city.length);
    const stateMatch = subsequentText.match(/([A-Z]{2})\s*\d{5}/);
    if (stateMatch && stateMatch[1]) {
      personalInfo.state = stateMatch[1].trim();
      const zipMatch = subsequentText.match(/\d{5}/);
      if (zipMatch && zipMatch[0]) {
        personalInfo.zipCode = zipMatch[0].trim();
      }
    }
  }

  // 4. Full Name (Heuristic: First non-contact, capitalized line in the first 5 lines)
  const nameCandidate = headerLines.slice(0, 5).find(
    (line) =>
      line.toUpperCase() === line && // All caps (JASON ROSS)
      !line.includes('@') && // Not an email
      !line.includes('http') && // Not a link
      !/^\d/.test(line) // Does not start with a number (like phone)
  );
  personalInfo.fullName = nameCandidate?.trim() || headerLines[0]?.trim() || '';
  
  // 5. Links (Heuristic: Look for common link prefixes)
  const links = headerLines
    .map(line => line.match(/(https?:\/\/(?:www\.)?(?:linkedin\.com|github\.com|(\w+\.com\/))\/[^\s]+)/i))
    .filter(match => match)
    .map(match => match![0]);
  
  personalInfo.linkedIn = links.find(l => /linkedin\.com/i.test(l));
  personalInfo.github = links.find(l => /github\.com/i.test(l));
  personalInfo.website = links.find(l => !/linkedin\.com|github\.com/i.test(l));

  return personalInfo;
}
