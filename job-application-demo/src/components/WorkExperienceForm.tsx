import {
  Box,
  TextField,
  Typography,
  Divider,
  Button,
  Paper,
  IconButton,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ResumeData } from '../types';

interface WorkExperienceFormProps {
  data: ResumeData['workExperience'];
  onChange: (data: ResumeData['workExperience']) => void;
}

export default function WorkExperienceForm({
  data,
  onChange,
}: WorkExperienceFormProps) {
  const handleAdd = () => {
    onChange([
      ...data,
      {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        current: false,
      },
    ]);
  };

  const handleRemove = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: keyof ResumeData['workExperience'][0],
    value: string | boolean
  ) => {
    const newData = [...data];
    newData[index] = { ...newData[index]!, [field]: value };
    onChange(newData);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Work Experience *
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {data.map((experience, index) => (
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
              label="Company"
              required
              fullWidth
              value={experience.company}
              onChange={(e) => handleChange(index, 'company', e.target.value)}
            />

            <TextField
              label="Position"
              required
              fullWidth
              value={experience.position}
              onChange={(e) => handleChange(index, 'position', e.target.value)}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Start Date"
                type="date"
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={experience.startDate}
                onChange={(e) =>
                  handleChange(index, 'startDate', e.target.value)
                }
              />
              <TextField
                label="End Date"
                type="date"
                required={!experience.current}
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={experience.endDate}
                onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                disabled={experience.current}
              />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={experience.current}
                  onChange={(e) =>
                    handleChange(index, 'current', e.target.checked)
                  }
                />
              }
              label="I currently work here"
            />

            <TextField
              label="Description"
              required
              fullWidth
              multiline
              rows={3}
              value={experience.description}
              onChange={(e) =>
                handleChange(index, 'description', e.target.value)
              }
              placeholder="Describe your responsibilities and achievements..."
            />
          </Box>
        </Paper>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={handleAdd}
        variant="outlined"
        fullWidth
      >
        Add Work Experience
      </Button>
    </Box>
  );
}
