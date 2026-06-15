import { Card as MuiCard, Box, Typography, type SxProps, type Theme } from '@mui/material';

export interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Leading mdi icon class for the header. */
  icon?: string;
  /** Right-aligned header content (e.g. a button or chip). */
  action?: React.ReactNode;
  /** Content padding in theme spacing units. @default 3 */
  padding?: number;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

/** Section card: white surface, soft shadow, optional header row. */
export function Card({ title, subtitle, icon, action, padding = 3, children, sx }: CardProps) {
  const hasHeader = title || action;
  return (
    <MuiCard sx={sx}>
      {hasHeader && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: padding,
            pt: padding,
            pb: subtitle ? 1 : 1.5,
          }}
        >
          {icon && (
            <span
              className={`mdi ${icon}`}
              aria-hidden
              style={{ fontSize: '1.5rem', color: 'var(--primary-600)' }}
            />
          )}
          <Box sx={{ minWidth: 0, flex: 1 }}>
            {title && (
              <Typography variant="h3" component="h2">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {action}
        </Box>
      )}
      <Box sx={{ p: padding, pt: hasHeader ? 1.5 : padding }}>{children}</Box>
    </MuiCard>
  );
}
