import { Card as MuiCard, Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { colors } from '@/theme';

export type StatTone = 'navy' | 'green' | 'gold' | 'teal' | 'primary';

export interface StatCardProps {
  /** Metric name, e.g. 'Ingresos brutos'. */
  label: string;
  /** The figure, e.g. '$84,200' or 128. */
  value: React.ReactNode;
  /** mdi icon class for the colored badge. */
  icon: string;
  /** Badge color. @default 'navy' */
  tone?: StatTone;
  /** Optional caption under the figure (e.g. a delta or hint). */
  hint?: React.ReactNode;
}

const toneColor: Record<StatTone, string> = {
  navy: colors.secondary[500],
  green: colors.success[500],
  gold: colors.warning[500],
  teal: colors.accent.teal,
  primary: colors.primary[500],
};

/** KPI tile: colored circular icon badge + large bold figure. */
export function StatCard({ label, value, icon, tone = 'navy', hint }: StatCardProps) {
  const c = toneColor[tone];
  return (
    <MuiCard sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(c, 0.12),
            color: c,
          }}
        >
          <span className={`mdi ${icon}`} aria-hidden style={{ fontSize: '1.7rem' }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="overline"
            component="div"
            sx={{ color: 'text.secondary', lineHeight: 1.4 }}
          >
            {label}
          </Typography>
          <Typography
            component="div"
            sx={{ fontSize: '2.25rem', fontWeight: 900, lineHeight: 1.1, color: 'text.primary' }}
          >
            {value}
          </Typography>
          {hint && (
            <Typography variant="caption" color="text.secondary">
              {hint}
            </Typography>
          )}
        </Box>
      </Box>
    </MuiCard>
  );
}
