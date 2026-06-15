import {
  Switch as MuiSwitch,
  type SwitchProps as MuiSwitchProps,
  FormControlLabel,
} from '@mui/material';

export interface SwitchProps extends Omit<MuiSwitchProps, 'color'> {
  label?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success';
}

export function Switch({ label, color = 'primary', ...rest }: SwitchProps) {
  const control = <MuiSwitch color={color} {...rest} />;
  if (!label) return control;
  return (
    <FormControlLabel
      control={control}
      label={label}
      sx={{ '& .MuiFormControlLabel-label': { fontSize: '1rem' } }}
    />
  );
}
