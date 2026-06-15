import {
  IconButton as MuiIconButton,
  type IconButtonProps as MuiIconButtonProps,
  Tooltip,
} from '@mui/material';

const colorMap = {
  default: 'default',
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  danger: 'error',
} as const;

export interface IconButtonProps extends Omit<MuiIconButtonProps, 'color'> {
  /** mdi icon class, e.g. 'mdi-pencil'. */
  icon: string;
  /** Accessible label (required — icon-only control). */
  label: string;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'danger';
  /** Show `label` in a tooltip on hover/focus. */
  tooltip?: boolean;
}

export function IconButton({
  icon,
  label,
  color = 'default',
  tooltip = false,
  size = 'medium',
  ...rest
}: IconButtonProps) {
  const button = (
    <MuiIconButton aria-label={label} color={colorMap[color]} size={size} {...rest}>
      <span className={`mdi ${icon}`} aria-hidden style={{ fontSize: size === 'small' ? '1.25rem' : '1.5rem' }} />
    </MuiIconButton>
  );
  return tooltip ? (
    <Tooltip title={label} arrow>
      {button}
    </Tooltip>
  ) : (
    button
  );
}
