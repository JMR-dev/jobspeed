import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { ResumeData } from './types';
import PersonalInfoForm from './components/PersonalInfoForm';
import WorkExperienceForm from './components/WorkExperienceForm';
import EducationForm from './components/EducationForm';
import CertificationsForm from './components/CertificationsForm';
import SkillsForm from './components/SkillsForm';
import SummaryForm from './components/SummaryForm';

function App() {
  const [formData, setFormData] = useState<ResumeData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      linkedIn: '',
      github: '',
      website: '',
    },
    workExperience: [],
    education: [],
    certifications: [],
    skills: [],
    summary: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const { personalInfo, workExperience, skills } = formData;
    if (
      !personalInfo.fullName ||
      !personalInfo.email ||
      !personalInfo.phone ||
      !personalInfo.address ||
      !personalInfo.city ||
      !personalInfo.state ||
      !personalInfo.zipCode ||
      !personalInfo.country
    ) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required personal information fields',
        severity: 'error',
      });
      return;
    }

    if (workExperience.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please add at least one work experience entry',
        severity: 'error',
      });
      return;
    }

    if (skills.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please add at least one skill',
        severity: 'error',
      });
      return;
    }

    try {
      // Get the current count from localStorage
      const count =
        parseInt(localStorage.getItem('applicationCount') || '0') + 1;
      localStorage.setItem('applicationCount', count.toString());

      // Create filename with timestamp
      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `job-application-${count}-${timestamp}.json`;

      // Create and download the JSON file
      const blob = new Blob([JSON.stringify(formData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: `Application saved as ${filename}`,
        severity: 'success',
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Error saving application',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Job Application Form
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          align="center"
          sx={{ mb: 3 }}
        >
          Fields marked with * are required
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <PersonalInfoForm
            data={formData.personalInfo}
            onChange={(personalInfo) =>
              setFormData({ ...formData, personalInfo })
            }
          />

          <WorkExperienceForm
            data={formData.workExperience}
            onChange={(workExperience) =>
              setFormData({ ...formData, workExperience })
            }
          />

          <EducationForm
            data={formData.education || []}
            onChange={(education) => setFormData({ ...formData, education })}
          />

          <CertificationsForm
            data={formData.certifications || []}
            onChange={(certifications) =>
              setFormData({ ...formData, certifications })
            }
          />

          <SkillsForm
            data={formData.skills}
            onChange={(skills) => setFormData({ ...formData, skills })}
          />

          <SummaryForm
            data={formData.summary || ''}
            onChange={(summary) => setFormData({ ...formData, summary })}
          />

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ minWidth: 200 }}
            >
              Submit Application
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
