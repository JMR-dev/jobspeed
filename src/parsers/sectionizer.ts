/**
 * Splits raw resume text into distinct logical sections based on common headers.
 * The part before the first recognized header is stored as 'header'.
 */
export function sectionizeResume(rawText: string): Record<string, string[]> {
  const lines = rawText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // Use a map of normalized keywords to the internal section key
  const keywordMap: Record<string, string> = {
    'summary': 'summary',
    'objective': 'summary',
    'professional summary': 'summary',
    'profile': 'summary',

    'experience': 'workExperience',
    'professional experience': 'workExperience',
    'work history': 'workExperience',
    'employment': 'workExperience',
    'relevant experience': 'workExperience',

    'education': 'education',
    'academic background': 'education',

    'skills': 'skills',
    'technical skills': 'skills',
    'proficiencies': 'skills',
    'expertise': 'skills',
  };

  const sections: Record<string, string[]> = {
    header: [],
    summary: [],
    workExperience: [],
    education: [],
    skills: [],
  };

  let currentSection = 'header';

  for (const line of lines) {
    const normalizedLine = line.toLowerCase();
    let foundSection = false;

    for (const [keyword, sectionKey] of Object.entries(keywordMap)) {
      // Check if the line is a major section header
      if (normalizedLine.startsWith(keyword) && line.length < 50) {
        currentSection = sectionKey;
        foundSection = true;
        break;
      }
    }
// I'm not sure if this is the best approach. Re-evalutate in morning/soon
    if (!foundSection) {
      const section = sections[currentSection];
      if (section) {
        section.push(line);
      } else {
        sections[currentSection] = [line];
      }
    }
  }

  return sections;
}