import { Avatar as MuiAvatar } from '@mui/material';
import { colors } from '@/theme';

export interface AvatarProps {
  /** Full name; initials and color are derived from it. */
  name: string;
  src?: string;
  /** Diameter in px. @default 42 */
  size?: number;
}

const palette = [
  colors.primary[500],
  colors.secondary[500],
  colors.accent.teal,
  colors.brand.cyan,
  colors.warning[500],
  colors.success[500],
  colors.info[500],
];

function colorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return palette[Math.abs(hash) % palette.length];
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
}

/** Circular avatar with deterministic color from the name (or an image). */
export function Avatar({ name, src, size = 42 }: AvatarProps) {
  return (
    <MuiAvatar
      src={src}
      alt={name}
      sx={{
        width: size,
        height: size,
        bgcolor: src ? undefined : colorFor(name),
        color: '#fff',
        fontWeight: 800,
        fontSize: size * 0.4,
      }}
    >
      {initialsOf(name)}
    </MuiAvatar>
  );
}
