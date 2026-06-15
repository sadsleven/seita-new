import {
  Checkbox as MuiCheckbox,
  type CheckboxProps as MuiCheckboxProps,
  FormControlLabel,
} from '@mui/material';

export interface CheckboxProps extends Omit<MuiCheckboxProps, 'color'> {
  label?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success';
}

export function Checkbox({ label, color = 'primary', ...rest }: CheckboxProps) {
  const control = <MuiCheckbox color={color} {...rest} />;
  if (!label) return control;
  return (
    <FormControlLabel
      control={control}
      label={label}
      sx={{ '& .MuiFormControlLabel-label': { fontSize: '1rem' } }}
    />
  );
}
