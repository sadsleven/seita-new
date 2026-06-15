import { useId } from 'react';
import {
  Box,
  FormControl,
  FormHelperText,
  MenuItem,
  Select as MuiSelect,
  type SelectChangeEvent,
} from '@mui/material';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {
  label?: string;
  value: string | number | '';
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
  helperText?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  id?: string;
}

/** Outlined select with a bold label above — matches the TextField pattern. */
export function Select({
  label,
  value,
  onChange,
  options,
  placeholder = 'Selecciona una opción',
  error = false,
  helperText,
  required = false,
  disabled = false,
  fullWidth = true,
  id,
}: SelectProps) {
  const reactId = useId();
  const fieldId = id ?? reactId;
  const handle = (e: SelectChangeEvent<string | number>) => onChange(String(e.target.value));

  return (
    <FormControl fullWidth={fullWidth} error={error} disabled={disabled}>
      {label && (
        <Box
          component="label"
          htmlFor={fieldId}
          sx={{ display: 'block', fontWeight: 700, fontSize: '1rem', color: error ? 'error.main' : 'text.primary', mb: 0.75 }}
        >
          {label}
          {required && (
            <Box component="span" sx={{ color: 'error.main' }}>
              {' *'}
            </Box>
          )}
        </Box>
      )}
      <MuiSelect
        id={fieldId}
        value={value}
        onChange={handle}
        displayEmpty
        renderValue={(selected) => {
          if (selected === '' || selected === undefined || selected === null) {
            return <Box sx={{ color: 'text.secondary' }}>{placeholder}</Box>;
          }
          return options.find((o) => o.value === selected)?.label ?? String(selected);
        }}
      >
        {options.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {(error || helperText) && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
