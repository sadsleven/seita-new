import { forwardRef, useId } from 'react';
import {
  Box,
  FormControl,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
  type OutlinedInputProps,
} from '@mui/material';

export interface TextFieldProps
  extends Omit<OutlinedInputProps, 'error' | 'startAdornment' | 'endAdornment'> {
  /** Bold label rendered above the field (always visible — the SEITA pattern). */
  label?: string;
  /** Leading mdi icon class. */
  icon?: string;
  /** Trailing adornment (e.g. a show/hide password button). */
  endIcon?: React.ReactNode;
  error?: boolean;
  helperText?: React.ReactNode;
  required?: boolean;
}

/**
 * Outlined text field with a bold label above and optional leading icon /
 * trailing adornment. forwardRef + spread make it drop-in for React Hook Form's
 * `register`. 56px tall, 2px outline (from the theme).
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, icon, endIcon, error = false, helperText, required = false, id, fullWidth = true, sx, ...inputProps },
  ref,
) {
  const reactId = useId();
  const fieldId = id ?? reactId;

  return (
    <FormControl fullWidth={fullWidth} error={error} sx={sx}>
      {label && (
        <Box
          component="label"
          htmlFor={fieldId}
          sx={{
            display: 'block',
            fontWeight: 700,
            fontSize: '1rem',
            color: error ? 'error.main' : 'text.primary',
            mb: 0.75,
          }}
        >
          {label}
          {required && (
            <Box component="span" sx={{ color: 'error.main' }}>
              {' *'}
            </Box>
          )}
        </Box>
      )}
      <OutlinedInput
        id={fieldId}
        inputRef={ref}
        error={error}
        fullWidth={fullWidth}
        startAdornment={
          icon ? (
            <InputAdornment position="start">
              <span className={`mdi ${icon}`} aria-hidden style={{ fontSize: '1.4rem', color: 'var(--neutral-500)' }} />
            </InputAdornment>
          ) : undefined
        }
        endAdornment={endIcon ? <InputAdornment position="end">{endIcon}</InputAdornment> : undefined}
        {...inputProps}
      />
      {(error || helperText) && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
});
