import { Alert as MuiAlert, AlertTitle, type AlertProps as MuiAlertProps } from '@mui/material';

export interface AlertProps extends Omit<MuiAlertProps, 'title'> {
  severity?: 'success' | 'info' | 'warning' | 'error';
  title?: React.ReactNode;
}

const iconFor: Record<string, string> = {
  success: 'mdi-check-circle',
  info: 'mdi-information',
  warning: 'mdi-alert',
  error: 'mdi-alert-circle',
};

export function Alert({ severity = 'info', title, children, ...rest }: AlertProps) {
  return (
    <MuiAlert
      severity={severity}
      variant="standard"
      iconMapping={{
        [severity]: <span className={`mdi ${iconFor[severity]}`} aria-hidden style={{ fontSize: '1.4rem' }} />,
      }}
      sx={{ borderRadius: 'var(--radius-md)', alignItems: 'center', fontSize: '1rem' }}
      {...rest}
    >
      {title && <AlertTitle sx={{ fontWeight: 800, mb: children ? 0.5 : 0 }}>{title}</AlertTitle>}
      {children}
    </MuiAlert>
  );
}
