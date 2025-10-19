import type { ResumeData, MessageResponse } from './types';

document.addEventListener('DOMContentLoaded', () => {
  const uploadButton = document.getElementById(
    'upload-button'
  ) as HTMLButtonElement;
  const resumeFileInput = document.getElementById(
    'resume-file-input'
  ) as HTMLInputElement;
  const resumeStatus = document.getElementById('resume-status');
  const resumePreview = document.getElementById('resume-preview');
  const resumeDataDiv = document.getElementById('resume-data');
  const clearResumeButton = document.getElementById(
    'clear-resume-button'
  ) as HTMLButtonElement;
  const scanPageButton = document.getElementById(
    'scan-page-button'
  ) as HTMLButtonElement;

  // Load and display existing resume data
  void loadResumeStatus();

  uploadButton.addEventListener('click', () => {
    resumeFileInput.click();
  });

  resumeFileInput.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    void (async () => {
      try {
        const text = await file.text();
        const resumeData = parseResume(text);

        await browser.runtime.sendMessage({
          type: 'SAVE_RESUME_DATA',
          data: resumeData,
        });

        await loadResumeStatus();
        alert('Resume uploaded successfully!');
      } catch (error) {
        console.error('Error uploading resume:', error);
        alert('Error uploading resume. Please try again.');
      }
    })();
  });

  clearResumeButton.addEventListener('click', () => {
    if (!confirm('Are you sure you want to clear your resume data?')) {
      return;
    }

    void (async () => {
      try {
        await browser.runtime.sendMessage({
          type: 'SAVE_RESUME_DATA',
          data: null,
        });

        await loadResumeStatus();
        alert('Resume cleared successfully!');
      } catch (error) {
        console.error('Error clearing resume:', error);
        alert('Error clearing resume. Please try again.');
      }
    })();
  });

  scanPageButton.addEventListener('click', () => {
    void (async () => {
      try {
        const tabs = await browser.tabs.query({
          active: true,
          currentWindow: true,
        });
        const activeTab = tabs[0];

        if (!activeTab?.id) {
          alert('No active tab found');
          return;
        }

        await browser.tabs.sendMessage(activeTab.id, {
          type: 'SCAN_PAGE',
        });

        window.close();
      } catch (error) {
        console.error('Error scanning page:', error);
        alert('Error scanning page. Please try again.');
      }
    })();
  });

  async function loadResumeStatus() {
    try {
      const response = (await browser.runtime.sendMessage({
        type: 'GET_RESUME_DATA',
      })) as MessageResponse;

      if (response.success && response.data) {
        const resumeData = response.data as ResumeData;
        displayResumeData(resumeData);
        resumeStatus?.classList.add('has-resume');
        if (resumeStatus) {
          const statusText = resumeStatus.querySelector('.status-text');
          if (statusText) {
            statusText.textContent = 'Resume uploaded ✓';
          }
        }
        resumePreview?.classList.remove('hidden');
        if (scanPageButton) {
          scanPageButton.disabled = false;
        }
      } else {
        resumeStatus?.classList.remove('has-resume');
        if (resumeStatus) {
          const statusText = resumeStatus.querySelector('.status-text');
          if (statusText) {
            statusText.textContent = 'No resume uploaded';
          }
        }
        resumePreview?.classList.add('hidden');
        if (scanPageButton) {
          scanPageButton.disabled = true;
        }
      }
    } catch (error) {
      console.error('Error loading resume status:', error);
    }
  }

  function displayResumeData(data: ResumeData) {
    if (!resumeDataDiv) return;

    const html = `
      <p><strong>Name:</strong> ${data.personalInfo.fullName}</p>
      <p><strong>Email:</strong> ${data.personalInfo.email}</p>
      <p><strong>Phone:</strong> ${data.personalInfo.phone}</p>
      <p><strong>Location:</strong> ${data.personalInfo.city}, ${data.personalInfo.state}</p>
      <p><strong>Skills:</strong> ${data.skills.slice(0, 5).join(', ')}${data.skills.length > 5 ? '...' : ''}</p>
    `;

    resumeDataDiv.innerHTML = html;
  }

  function parseResume(text: string): ResumeData {
    // Basic resume parser - extracts email, phone, and text content
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
    const phoneRegex =
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

    const email = text.match(emailRegex)?.[0] || '';
    const phone = text.match(phoneRegex)?.[0] || '';

    // Extract name (assume first line is name)
    const lines = text.split('\n').filter((line) => line.trim());
    const fullName = lines[0] || '';

    // Basic skill extraction (look for common keywords)
    const skillKeywords = [
      'JavaScript',
      'TypeScript',
      'Python',
      'Java',
      'React',
      'Node.js',
      'SQL',
      'HTML',
      'CSS',
      'Git',
      'AWS',
      'Azure',
      'Docker',
      'Kubernetes',
    ];
    const skills = skillKeywords.filter((skill) =>
      text.toLowerCase().includes(skill.toLowerCase())
    );

    return {
      personalInfo: {
        fullName,
        email,
        phone,
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      workExperience: [],
      education: [],
      skills,
      summary: text.substring(0, 500),
    };
  }
});
