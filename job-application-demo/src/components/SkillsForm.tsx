import { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Divider,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ResumeData } from '../types';

interface SkillsFormProps {
  data: ResumeData['skills'];
  onChange: (data: ResumeData['skills']) => void;
}

export default function SkillsForm({ data, onChange }: SkillsFormProps) {
  const [skillInput, setSkillInput] = useState('');

  const handleAdd = () => {
    if (skillInput.trim() && !data.includes(skillInput.trim())) {
      onChange([...data, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemove = (skillToRemove: string) => {
    onChange(data.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Skills *
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          label="Add a skill"
          fullWidth
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., JavaScript, Python, Project Management"
        />
        <Button
          variant="contained"
          onClick={handleAdd}
          startIcon={<AddIcon />}
          sx={{ minWidth: 100 }}
        >
          Add
        </Button>
      </Box>

      {data.length > 0 ? (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {data.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              onDelete={() => handleRemove(skill)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No skills added yet. Please add at least one skill.
        </Typography>
      )}
    </Box>
  );
}
