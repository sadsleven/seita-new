import { Button as MuiButton, type ButtonProps as MuiButtonProps } from '@mui/material';

const colorMap = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  danger: 'error',
} as const;

const sizeMap = { sm: 'small', md: 'medium', lg: 'large' } as const;

export interface ButtonProps extends Omit<MuiButtonProps, 'color' | 'size' | 'variant'> {
  variant?: 'contained' | 'outlined' | 'text';
  /** SEITA color name; `danger` maps to MUI `error`. */
  color?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Leading mdi icon class, e.g. 'mdi-plus'. */
  icon?: string;
  /** Trailing mdi icon class. */
  trailingIcon?: string;
  loading?: boolean;
}

export function Button({
  variant = 'contained',
  color = 'primary',
  size = 'md',
  icon,
  trailingIcon,
  loading = false,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <MuiButton
      variant={variant}
      color={colorMap[color]}
      size={sizeMap[size]}
      disabled={disabled || loading}
      startIcon={
        loading ? (
          <span className="mdi mdi-loading mdi-spin" aria-hidden style={{ fontSize: '1.25em' }} />
        ) : icon ? (
          <span className={`mdi ${icon}`} aria-hidden style={{ fontSize: '1.25em' }} />
        ) : undefined
      }
      endIcon={
        trailingIcon ? (
          <span className={`mdi ${trailingIcon}`} aria-hidden style={{ fontSize: '1.25em' }} />
        ) : undefined
      }
      {...rest}
    >
      {children}
    </MuiButton>
  );
}
