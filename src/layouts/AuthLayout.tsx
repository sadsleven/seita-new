import { Box, Typography } from '@mui/material';

export interface AuthLayoutProps {
  logoSrc?: string;
  /** Brand-panel headline. */
  headline?: string;
  /** Brand-panel supporting copy. */
  blurb?: string;
  children: React.ReactNode;
}

/**
 * Split-screen auth layout: soft-blue brand aside (logo + headline + translucent
 * cyan orbs) and a centered content column for the form. The aside collapses on
 * small screens, where a compact logo sits above the form instead.
 */
export function AuthLayout({
  logoSrc = '/intertechtransparent.png',
  headline = 'Gestión de eventos, plantas y productos',
  blurb = 'Organiza tus próximos congresos y ferias técnicas, administra las plantas participantes y sus productos desde un solo lugar.',
  children,
}: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        bgcolor: 'background.paper',
      }}
    >
      {/* Brand aside */}
      <Box
        component="aside"
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'brand.soft',
          p: '48px 56px',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ position: 'absolute', right: -70, bottom: 40, width: 280, height: 280, borderRadius: '50%', bgcolor: 'rgba(41,171,226,0.16)' }} />
        <Box sx={{ position: 'absolute', right: 90, bottom: -60, width: 220, height: 220, borderRadius: '50%', bgcolor: 'rgba(0,53,150,0.08)' }} />
        <Box
          sx={{
            position: 'relative',
            alignSelf: 'flex-start',
            display: 'inline-flex',
            bgcolor: 'background.paper',
            borderRadius: '14px',
            p: '16px 22px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <Box component="img" src={logoSrc} alt="InterTech Americas" sx={{ height: 64, width: 'auto', display: 'block' }} />
        </Box>
        <Box sx={{ position: 'relative', maxWidth: 420 }}>
          <Typography component="h1" sx={{ fontSize: 'var(--text-h1)', fontWeight: 900, color: 'brand.navy', lineHeight: 1.15, mb: 2 }}>
            {headline}
          </Typography>
          <Typography sx={{ fontSize: 'var(--text-lead)', color: 'var(--neutral-700)', lineHeight: 1.55 }}>
            {blurb}
          </Typography>
        </Box>
        <Typography component="span" sx={{ position: 'relative', fontSize: 'var(--text-xs)', color: 'var(--neutral-500)' }}>
          © 2026 InterTech Americas, Corp
        </Typography>
      </Box>

      {/* Form column */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: '40px 24px', md: '40px 24px' } }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mb: 3 }}>
            <Box
              sx={{
                display: 'inline-flex',
                bgcolor: 'background.paper',
                borderRadius: '12px',
                p: '12px 18px',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <Box component="img" src={logoSrc} alt="InterTech Americas" sx={{ height: 48, width: 'auto', display: 'block' }} />
            </Box>
          </Box>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
