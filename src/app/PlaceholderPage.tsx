import { Box, Stack, Typography } from '@mui/material';
import { Card } from '@/components/ui';

export interface PlaceholderPageProps {
  title: string;
  icon?: string;
  description?: string;
}

/** Friendly stand-in for sections not yet built (events, plants, catalogs…). */
export function PlaceholderPage({
  title,
  icon = 'mdi-hammer-wrench',
  description = 'Esta sección estará disponible muy pronto.',
}: PlaceholderPageProps) {
  return (
    <Stack spacing={3}>
      <Typography variant="h1" component="h1">
        {title}
      </Typography>
      <Card>
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              mx: 'auto',
              mb: 2,
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'brand.soft',
              color: 'primary.dark',
            }}
          >
            <span className={`mdi ${icon}`} aria-hidden style={{ fontSize: '2.2rem' }} />
          </Box>
          <Typography variant="h3" component="p">
            En construcción
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {description}
          </Typography>
        </Box>
      </Card>
    </Stack>
  );
}
