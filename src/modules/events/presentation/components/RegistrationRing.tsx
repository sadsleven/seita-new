import { Box, Typography } from '@mui/material';

export interface RegistrationRingProps {
  value: number;
  total: number;
  color: string;
  label: string;
}

/** Donut gauge for the Panel de Registro (value over total). */
export function RegistrationRing({ value, total, color, label }: RegistrationRingProps) {
  const frac = total > 0 ? Math.min(value / total, 1) : 0;
  const size = 92;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, minWidth: 96 }}>
      <Box sx={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--neutral-100)" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - frac)}
          />
        </svg>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            fontWeight: 900,
            color: 'text.primary',
          }}
        >
          {value}
        </Box>
      </Box>
      <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, textAlign: 'center' }}>{label}</Typography>
    </Box>
  );
}
