import { Box } from '@mui/material';
import { colors } from '@/theme';

export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary';

export interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
  /** Show a leading dot. @default true */
  dot?: boolean;
}

const tonePair: Record<StatusTone, { bg: string; fg: string }> = {
  success: { bg: colors.success[50], fg: colors.success[600] },
  warning: { bg: colors.warning[50], fg: colors.warning[600] },
  error: { bg: colors.error[50], fg: colors.error[600] },
  info: { bg: colors.info[50], fg: colors.info[600] },
  primary: { bg: colors.primary[50], fg: colors.primary[700] },
  neutral: { bg: colors.neutral[100], fg: colors.neutral[600] },
};

/** Soft-tinted status pill (e.g. ACTIVO, FINALIZADO, PAGADA). */
export function StatusBadge({ label, tone = 'neutral', dot = true }: StatusBadgeProps) {
  const { bg, fg } = tonePair[tone];
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.25,
        py: 0.5,
        borderRadius: 999,
        bgcolor: bg,
        color: fg,
        fontSize: '0.8125rem',
        fontWeight: 800,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}
    >
      {dot && (
        <Box component="span" sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: fg }} />
      )}
      {label}
    </Box>
  );
}
