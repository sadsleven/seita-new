import { Chip as MuiChip, type ChipProps as MuiChipProps } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { colors } from '@/theme';

export type ChipTone = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

export interface ChipProps extends Omit<MuiChipProps, 'color' | 'icon' | 'variant'> {
  label: React.ReactNode;
  tone?: ChipTone;
  /** Leading mdi icon class. */
  icon?: string;
  /** 'soft' = tinted background (default), 'solid' = filled, 'outlined'. */
  variant?: 'soft' | 'solid' | 'outlined';
}

const toneBase: Record<ChipTone, string> = {
  default: colors.neutral[500],
  primary: colors.primary[500],
  success: colors.success[500],
  warning: colors.warning[500],
  error: colors.error[500],
  info: colors.info[500],
};

export function Chip({ label, tone = 'default', icon, variant = 'soft', sx, ...rest }: ChipProps) {
  const base = toneBase[tone];
  const variantSx =
    variant === 'solid'
      ? { bgcolor: base, color: '#fff' }
      : variant === 'outlined'
        ? { bgcolor: 'transparent', color: base, border: `1.5px solid ${alpha(base, 0.5)}` }
        : { bgcolor: alpha(base, 0.13), color: tone === 'default' ? colors.neutral[700] : base };

  return (
    <MuiChip
      label={label}
      icon={icon ? <span className={`mdi ${icon}`} aria-hidden style={{ fontSize: '1.1rem' }} /> : undefined}
      sx={{ fontWeight: 700, ...variantSx, '& .MuiChip-icon': { color: 'inherit', ml: 1 }, ...sx }}
      {...rest}
    />
  );
}
