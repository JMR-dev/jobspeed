import React, { useState } from 'react';
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
  Stack,
  LinearProgress,
} from '@mui/material';
import {
  Upload as UploadIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import type { ResumeData } from './types';
import { parseResumeFile } from './utils/resumeParser';

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

const UploadApp: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Parse the resume file client-side
      const parsedData = await parseResumeFile(file);

      await browser.runtime.sendMessage({
        type: 'SAVE_RESUME_DATA',
        data: parsedData,
      });

      setResumeData(parsedData);
      setUploadSuccess(true);
    } catch (err) {
      console.error('Error uploading resume:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Error uploading resume. Please try again.';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    window.close();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <AppBar
          position="static"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
                JobSpeed - Upload Resume
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Select your resume file to upload
              </Typography>
            </Box>
            <Button
              color="inherit"
              startIcon={<CloseIcon />}
              onClick={handleClose}
              sx={{ textTransform: 'none' }}
            >
              Close
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 600,
              width: '100%',
            }}
          >
            <Stack spacing={3}>
              {uploading && (
                <>
                  <Typography variant="h6" align="center">
                    Uploading Resume...
                  </Typography>
                  <LinearProgress />
                </>
              )}

              {!uploading && !uploadSuccess && (
                <>
                  <Typography variant="h6" align="center">
                    Select Resume File
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Supported formats: PDF, DOCX
                  </Typography>

                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<UploadIcon />}
                    fullWidth
                    size="large"
                    sx={{
                      background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      textTransform: 'none',
                      py: 2,
                    }}
                  >
                    Choose File
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.docx"
                      onChange={(e) => void handleFileChange(e)}
                    />
                  </Button>
                </>
              )}

              {uploadSuccess && resumeData && (
                <>
                  <Box sx={{ textAlign: 'center' }}>
                    <CheckCircleIcon
                      sx={{ fontSize: 64, color: 'success.main', mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      Resume Uploaded Successfully!
                    </Typography>
                  </Box>

                  <Alert severity="success">
                    Your resume data has been saved and is ready to use for
                    auto-filling job applications.
                  </Alert>

                  <Box sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, fontWeight: 600 }}
                    >
                      Extracted Data
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
                    variant="contained"
                    onClick={handleClose}
                    fullWidth
                    sx={{
                      background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      textTransform: 'none',
                      py: 1.5,
                    }}
                  >
                    Done
                  </Button>
                </>
              )}

              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

// Mount the React app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<UploadApp />);
}
