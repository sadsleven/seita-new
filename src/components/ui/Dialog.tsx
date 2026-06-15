import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
} from '@mui/material';
import { IconButton } from './IconButton';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Leading mdi icon class for the header. */
  icon?: string;
  /** Footer actions (buttons). */
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

/**
 * Modal dialog. MUI handles focus trapping and Esc-to-close; we add a header
 * with optional icon and a close button.
 */
export function Dialog({
  open,
  onClose,
  title,
  subtitle,
  icon,
  actions,
  maxWidth = 'sm',
  children,
}: DialogProps) {
  return (
    <MuiDialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      {(title || icon) && (
        <DialogTitle component="div" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, pr: 6 }}>
          {icon && (
            <span
              className={`mdi ${icon}`}
              aria-hidden
              style={{ fontSize: '1.6rem', color: 'var(--primary-600)', marginTop: 2 }}
            />
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h3" component="h2">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
            <IconButton label="Cerrar" icon="mdi-close" onClick={onClose} />
          </Box>
        </DialogTitle>
      )}
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>{actions}</DialogActions>}
    </MuiDialog>
  );
}
