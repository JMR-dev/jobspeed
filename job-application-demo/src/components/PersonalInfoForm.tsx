import { Box, TextField, Typography, Divider } from '@mui/material';
import { ResumeData } from '../types';

interface PersonalInfoFormProps {
  data: ResumeData['personalInfo'];
  onChange: (data: ResumeData['personalInfo']) => void;
}

export default function PersonalInfoForm({
  data,
  onChange,
}: PersonalInfoFormProps) {
  const handleChange =
    (field: keyof ResumeData['personalInfo']) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...data, [field]: e.target.value });
    };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Full Name"
          required
          fullWidth
          value={data.fullName}
          onChange={handleChange('fullName')}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            required
            fullWidth
            value={data.email}
            onChange={handleChange('email')}
            slotProps={{
              htmlInput: {
                pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
              },
            }}
            helperText="Enter a valid email address"
          />
          <TextField
            label="Phone"
            type="tel"
            required
            fullWidth
            value={data.phone}
            onChange={handleChange('phone')}
            slotProps={{
              htmlInput: {
                pattern: '^\\+?[1-9]\\d{1,14}$',
              },
            }}
            helperText="Include country code (e.g., +1 for US)"
          />
        </Box>

        <TextField
          label="Address"
          required
          fullWidth
          value={data.address}
          onChange={handleChange('address')}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="City"
            required
            fullWidth
            value={data.city}
            onChange={handleChange('city')}
          />
          <TextField
            label="State"
            required
            fullWidth
            value={data.state}
            onChange={handleChange('state')}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Zip Code"
            required
            fullWidth
            value={data.zipCode}
            onChange={handleChange('zipCode')}
            slotProps={{
              htmlInput: {
                pattern: '^\\d{5}$',
              },
            }}
            helperText="Enter 5-digit zip code"
          />
          <TextField
            label="Country"
            required
            fullWidth
            value={data.country}
            onChange={handleChange('country')}
          />
        </Box>

        <TextField
          label="LinkedIn Profile"
          fullWidth
          value={data.linkedIn || ''}
          onChange={handleChange('linkedIn')}
          placeholder="https://linkedin.com/in/username"
        />

        <TextField
          label="GitHub Profile"
          fullWidth
          value={data.github || ''}
          onChange={handleChange('github')}
          placeholder="https://github.com/username"
        />

        <TextField
          label="Personal Website"
          fullWidth
          value={data.website || ''}
          onChange={handleChange('website')}
          placeholder="https://yourwebsite.com"
        />
      </Box>
    </Box>
  );
}
