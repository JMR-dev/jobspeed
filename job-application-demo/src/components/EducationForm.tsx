import {
  Box,
  TextField,
  Typography,
  Divider,
  Button,
  Paper,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ResumeData } from '../types';

interface EducationFormProps {
  data: NonNullable<ResumeData['education']>;
  onChange: (data: NonNullable<ResumeData['education']>) => void;
}

export default function EducationForm({ data, onChange }: EducationFormProps) {
  const handleAdd = () => {
    onChange([
      ...data,
      {
        institution: '',
        degree: '',
        field: '',
        graduationDate: '',
        gpa: '',
      },
    ]);
  };

  const handleRemove = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: keyof NonNullable<ResumeData['education']>[0],
    value: string
  ) => {
    const newData = [...data];
    newData[index] = { ...newData[index]!, [field]: value };
    onChange(newData);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Education
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {data.map((education, index) => (
        <Paper
          key={index}
          elevation={1}
          sx={{ p: 3, mb: 2, position: 'relative' }}
        >
          <IconButton
            onClick={() => handleRemove(index)}
            sx={{ position: 'absolute', top: 20, right: 4 }}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Institution"
              required
              fullWidth
              value={education.institution}
              onChange={(e) =>
                handleChange(index, 'institution', e.target.value)
              }
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Degree"
                required
                fullWidth
                value={education.degree}
                onChange={(e) => handleChange(index, 'degree', e.target.value)}
              />
              <TextField
                label="Field of Study"
                fullWidth
                value={education.field || ''}
                onChange={(e) => handleChange(index, 'field', e.target.value)}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Graduation Date"
                type="date"
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={education.graduationDate}
                onChange={(e) =>
                  handleChange(index, 'graduationDate', e.target.value)
                }
              />
              <TextField
                label="GPA"
                fullWidth
                value={education.gpa || ''}
                onChange={(e) => handleChange(index, 'gpa', e.target.value)}
                placeholder="e.g., 3.50"
                slotProps={{
                  htmlInput: {
                    pattern: '^[1-4]\\.[0-9]{2}$',
                  },
                }}
                helperText="Format: X.XX (1.00-4.99)"
              />
            </Box>
          </Box>
        </Paper>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={handleAdd}
        variant="outlined"
        fullWidth
      >
        Add Education
      </Button>
    </Box>
  );
}
