import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Button,
  Alert,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import type { ResumeData } from './types';

// Create a custom theme for the extension
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  },
});

const PopupApp: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  useEffect(() => {
    void loadResumeStatus();
  }, []);

  const loadResumeStatus = async () => {
    try {
      const response = (await browser.runtime.sendMessage({
        type: 'GET_RESUME_DATA',
      })) as { success: boolean; data?: ResumeData | null };

      if (response.success && response.data) {
        setResumeData(response.data);
      }
    } catch (error) {
      console.error('Error loading resume:', error);
    }
  };

  const handleUploadResume = () => {
    // Open the upload page in a new tab to avoid popup closing in Firefox
    void browser.tabs.create({
      url: browser.runtime.getURL('upload.html'),
    });
    window.close();
  };

  const handleClearResume = async () => {
    if (!confirm('Are you sure you want to clear your resume data?')) {
      return;
    }

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
  };

  const handleScanPage = async () => {
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
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: 400, bgcolor: 'background.default' }}>
        {/* Header */}
        <AppBar
          position="static"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <Toolbar>
            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
                JobSpeed
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Auto-fill job applications
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box sx={{ p: 2.5 }}>
          {/* Resume Section */}
          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'white' }}>
            <Stack spacing={2}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Resume
                </Typography>
                {resumeData && (
                  <Chip
                    icon={<DescriptionIcon />}
                    label="Uploaded"
                    color="success"
                    size="small"
                  />
                )}
              </Box>

              {!resumeData ? (
                <Alert severity="info" sx={{ mb: 1 }}>
                  No resume uploaded
                </Alert>
              ) : (
                <Alert severity="success" sx={{ mb: 1 }}>
                  Resume data loaded
                </Alert>
              )}

              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={handleUploadResume}
                fullWidth
                sx={{
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  textTransform: 'none',
                  py: 1.5,
                }}
              >
                Upload Resume
              </Button>

              {resumeData && (
                <>
                  <Divider />
                  <Box sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, fontWeight: 600 }}
                    >
                      Resume Data
                    </Typography>
                    <Stack
                      spacing={0.5}
                      sx={{ fontSize: '0.875rem', color: '#666' }}
                    >
                      {resumeData.personalInfo.fullName && (
                        <Typography variant="body2">
                          <strong>Name:</strong>{' '}
                          {resumeData.personalInfo.fullName}
                        </Typography>
                      )}
                      {resumeData.personalInfo.email && (
                        <Typography variant="body2">
                          <strong>Email:</strong>{' '}
                          {resumeData.personalInfo.email}
                        </Typography>
                      )}
                      {resumeData.personalInfo.phone && (
                        <Typography variant="body2">
                          <strong>Phone:</strong>{' '}
                          {resumeData.personalInfo.phone}
                        </Typography>
                      )}
                      {resumeData.personalInfo.address && (
                        <Typography variant="body2">
                          <strong>Address:</strong>{' '}
                          {resumeData.personalInfo.address}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => void handleClearResume()}
                    fullWidth
                    color="error"
                    sx={{ textTransform: 'none' }}
                  >
                    Clear Resume
                  </Button>
                </>
              )}
            </Stack>
          </Paper>

          {/* Actions Section */}
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'white' }}>
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Actions
              </Typography>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={() => void handleScanPage()}
                fullWidth
                sx={{
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  textTransform: 'none',
                  py: 1.5,
                }}
              >
                Scan Current Page
              </Button>
              <Typography variant="caption" color="text.secondary">
                Click to detect form fields on the current page and preview
                auto-fill suggestions
              </Typography>
            </Stack>
          </Paper>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 1.5,
            textAlign: 'center',
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: '#f8f9fa',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            v1.0.0
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

// Mount the React app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<PopupApp />);
}
