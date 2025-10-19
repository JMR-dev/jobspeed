import { Box, TextField, Typography, Divider } from '@mui/material';

interface SummaryFormProps {
  data: string;
  onChange: (data: string) => void;
}

export default function SummaryForm({ data, onChange }: SummaryFormProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Professional Summary
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <TextField
        label="Summary"
        fullWidth
        multiline
        rows={4}
        value={data}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Provide a brief professional summary highlighting your key qualifications and career objectives..."
      />
    </Box>
  );
}
