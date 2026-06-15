import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Link, Stack, Typography } from '@mui/material';
import { AuthLayout } from '@/layouts';
import { Alert, Button, PasswordField, TextField } from '@/components/ui';
import { useAuth } from '../hooks/useAuth';

const schema = z.object({
  email: z.string().min(1, 'Ingresa tu correo electrónico.').email('Correo no válido.'),
  password: z.string().min(1, 'Ingresa tu contraseña.'),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState('');

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/panel';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'julia.marin@intertech.com', password: 'demo1234' },
  });

  const onSubmit = async (values: FormValues) => {
    setFormError('');
    try {
      await login(values);
      navigate(from, { replace: true });
    } catch {
      setFormError('No pudimos iniciar sesión. Verifica tus datos e inténtalo de nuevo.');
    }
  };

  return (
    <AuthLayout>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.25}>
          <Box>
            <Typography variant="h2" component="h1">
              Iniciar sesión
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Ingresa tus credenciales para continuar
            </Typography>
          </Box>

          {formError && <Alert severity="error">{formError}</Alert>}

          <TextField
            label="Correo electrónico"
            type="email"
            icon="mdi-email-outline"
            placeholder="nombre@empresa.com"
            autoComplete="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
          />

          <PasswordField
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password')}
          />

          <Box sx={{ textAlign: 'right' }}>
            <Link href="#" onClick={(e) => e.preventDefault()} sx={{ fontSize: '0.9375rem' }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>

          <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
            Iniciar sesión
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
            Demostración — cualquier credencial funciona. Los datos se guardan solo en tu navegador.
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
}
