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

interface CertificationsFormProps {
  data: NonNullable<ResumeData['certifications']>;
  onChange: (data: NonNullable<ResumeData['certifications']>) => void;
}

export default function CertificationsForm({
  data,
  onChange,
}: CertificationsFormProps) {
  const handleAdd = () => {
    onChange([
      ...data,
      {
        certificationName: '',
        acquiredDate: '',
        areaOfExpertise: '',
      },
    ]);
  };

  const handleRemove = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: keyof NonNullable<ResumeData['certifications']>[0],
    value: string
  ) => {
    const newData = [...data];
    newData[index] = { ...newData[index]!, [field]: value };
    onChange(newData);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Certifications
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {data.map((certification, index) => (
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
              label="Certification Name"
              required
              fullWidth
              value={certification.certificationName}
              onChange={(e) =>
                handleChange(index, 'certificationName', e.target.value)
              }
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Acquired Date"
                type="date"
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={certification.acquiredDate}
                onChange={(e) =>
                  handleChange(index, 'acquiredDate', e.target.value)
                }
              />
              <TextField
                label="Area of Expertise"
                fullWidth
                value={certification.areaOfExpertise || ''}
                onChange={(e) =>
                  handleChange(index, 'areaOfExpertise', e.target.value)
                }
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
        Add Certification
      </Button>
    </Box>
  );
}
