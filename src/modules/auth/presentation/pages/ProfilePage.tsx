import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Stack, Typography } from '@mui/material';
import { Alert, Avatar, Button, Card, PasswordField, TextField } from '@/components/ui';
import { useAuth } from '../hooks/useAuth';

const profileSchema = z.object({
  firstName: z.string().min(1, 'El nombre es obligatorio.'),
  lastName: z.string().min(1, 'El apellido es obligatorio.'),
  email: z.string().min(1, 'El correo es obligatorio.').email('Correo no válido.'),
});
type ProfileValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Ingresa tu contraseña actual.'),
    newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres.'),
    confirm: z.string().min(1, 'Confirma la nueva contraseña.'),
  })
  .refine((v) => v.newPassword === v.confirm, {
    message: 'La confirmación no coincide.',
    path: ['confirm'],
  });
type PasswordValues = z.infer<typeof passwordSchema>;

export function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();
  const [profileSaved, setProfileSaved] = useState(false);
  const [pwMessage, setPwMessage] = useState<{ severity: 'success' | 'error'; text: string } | null>(null);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
    },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirm: '' },
  });

  const onSaveProfile = async (values: ProfileValues) => {
    await updateProfile(values);
    setProfileSaved(true);
  };

  const onChangePassword = async (values: PasswordValues) => {
    await changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
    passwordForm.reset();
    setPwMessage({ severity: 'success', text: 'Contraseña actualizada correctamente.' });
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h1" component="h1">
        Mi Perfil
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.25, alignItems: 'start' }}>
        <Card title="Mi perfil" icon="mdi-account-circle">
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2.5 }}>
            <Avatar name={`${profileForm.watch('firstName')} ${profileForm.watch('lastName')}`} size={64} />
            <Box>
              <Typography variant="h4" component="div">
                {profileForm.watch('firstName')} {profileForm.watch('lastName')}
              </Typography>
              <Typography sx={{ fontSize: '0.9375rem', color: 'text.secondary' }}>{user?.role}</Typography>
            </Box>
          </Stack>

          <Box component="form" onSubmit={profileForm.handleSubmit(onSaveProfile)} noValidate>
            <Stack spacing={2}>
              {profileSaved && (
                <Alert severity="success" onClose={() => setProfileSaved(false)}>
                  Perfil actualizado correctamente.
                </Alert>
              )}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  label="Nombre"
                  error={!!profileForm.formState.errors.firstName}
                  helperText={profileForm.formState.errors.firstName?.message}
                  {...profileForm.register('firstName')}
                />
                <TextField
                  label="Apellido"
                  error={!!profileForm.formState.errors.lastName}
                  helperText={profileForm.formState.errors.lastName?.message}
                  {...profileForm.register('lastName')}
                />
              </Box>
              <TextField
                label="Correo electrónico"
                type="email"
                icon="mdi-email-outline"
                error={!!profileForm.formState.errors.email}
                helperText={profileForm.formState.errors.email?.message}
                {...profileForm.register('email')}
              />
              <Button type="submit" icon="mdi-content-save" loading={profileForm.formState.isSubmitting}>
                Guardar Cambios
              </Button>
            </Stack>
          </Box>
        </Card>

        <Card title="Cambiar contraseña" icon="mdi-lock-reset">
          <Box component="form" onSubmit={passwordForm.handleSubmit(onChangePassword)} noValidate>
            <Stack spacing={2}>
              {pwMessage && (
                <Alert severity={pwMessage.severity} onClose={() => setPwMessage(null)}>
                  {pwMessage.text}
                </Alert>
              )}
              <PasswordField
                label="Contraseña actual"
                error={!!passwordForm.formState.errors.currentPassword}
                helperText={passwordForm.formState.errors.currentPassword?.message}
                {...passwordForm.register('currentPassword')}
              />
              <PasswordField
                label="Nueva contraseña"
                icon="mdi-lock-plus-outline"
                error={!!passwordForm.formState.errors.newPassword}
                helperText={passwordForm.formState.errors.newPassword?.message ?? 'Mínimo 6 caracteres'}
                {...passwordForm.register('newPassword')}
              />
              <PasswordField
                label="Confirmar nueva contraseña"
                icon="mdi-lock-check-outline"
                error={!!passwordForm.formState.errors.confirm}
                helperText={passwordForm.formState.errors.confirm?.message}
                {...passwordForm.register('confirm')}
              />
              <Button type="submit" icon="mdi-check" loading={passwordForm.formState.isSubmitting}>
                Actualizar Contraseña
              </Button>
            </Stack>
          </Box>
        </Card>
      </Box>
    </Stack>
  );
}
