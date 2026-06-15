import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box } from '@mui/material';
import { Button, Dialog, Select, TextField } from '@/components/ui';
import type { PlantCatalogs } from '../../domain/plantsGateway';
import type { CreatePlantInput } from '../../domain/models/Plant';

const schema = z.object({
  companyName: z.string().min(1, 'El nombre de la empresa es obligatorio.'),
  nickName: z.string().optional(),
  type: z.string().min(1, 'Selecciona un tipo de planta.'),
  country: z.string().min(1, 'Selecciona un país.'),
  city: z.string().optional(),
  industry: z.string().min(1, 'Selecciona una industria.'),
  email: z.string().email('Correo no válido.').or(z.literal('')).optional(),
  phone: z.string().optional(),
  taxId: z.string().optional(),
  invoiceName: z.string().optional(),
  web: z.string().optional(),
  source: z.string().optional(),
  association: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface PlantFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CreatePlantInput) => Promise<void>;
  catalogs: PlantCatalogs | undefined;
  busy?: boolean;
}

export function PlantFormDialog({
  open,
  onClose,
  onSubmit,
  catalogs,
  busy = false,
}: PlantFormDialogProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: '',
      nickName: '',
      type: '',
      country: '',
      city: '',
      industry: '',
      email: '',
      phone: '',
      taxId: '',
      invoiceName: '',
      web: '',
      source: '',
      association: '',
    },
  });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onValid = async (values: FormValues) => {
    await onSubmit({
      companyName: values.companyName,
      nickName: values.nickName,
      type: values.type,
      country: values.country,
      city: values.city,
      industry: values.industry,
      email: values.email,
      phone: values.phone,
      taxId: values.taxId,
      invoiceName: values.invoiceName,
      web: values.web,
      source: values.source,
      association: values.association,
    });
    handleClose();
  };

  const toOptions = (names: string[] = []) => names.map((n) => ({ value: n, label: n }));
  const pending = isSubmitting || busy;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Crear planta"
      icon="mdi-factory"
      maxWidth="md"
      actions={
        <>
          <Button variant="outlined" onClick={handleClose} disabled={pending}>
            Cancelar
          </Button>
          <Button
            icon="mdi-check"
            loading={pending}
            onClick={() => void handleSubmit(onValid)()}
          >
            Crear
          </Button>
        </>
      }
    >
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onValid)}
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5, pt: 1 }}
      >
        {/* Company name — full width */}
        <Box sx={{ gridColumn: '1 / -1' }}>
          <TextField
            label="Nombre de la empresa"
            placeholder="p. ej. Celulosa del Pacífico"
            required
            error={!!errors.companyName}
            helperText={errors.companyName?.message}
            {...register('companyName')}
          />
        </Box>

        <TextField
          label="Nombre corto / apodo"
          placeholder="p. ej. CelPac"
          error={!!errors.nickName}
          helperText={errors.nickName?.message}
          {...register('nickName')}
        />

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              label="Tipo de planta"
              value={field.value ?? ''}
              onChange={field.onChange}
              options={toOptions(catalogs?.plantTypes)}
              placeholder="Selecciona un tipo"
              error={!!errors.type}
              helperText={errors.type?.message}
              required
            />
          )}
        />

        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <Select
              label="País"
              value={field.value ?? ''}
              onChange={field.onChange}
              options={toOptions(catalogs?.countries)}
              placeholder="Selecciona un país"
              error={!!errors.country}
              helperText={errors.country?.message}
              required
            />
          )}
        />

        <TextField
          label="Ciudad"
          placeholder="p. ej. Monterrey"
          error={!!errors.city}
          helperText={errors.city?.message}
          {...register('city')}
        />

        <Controller
          name="industry"
          control={control}
          render={({ field }) => (
            <Select
              label="Industria"
              value={field.value ?? ''}
              onChange={field.onChange}
              options={toOptions(catalogs?.industries)}
              placeholder="Selecciona una industria"
              error={!!errors.industry}
              helperText={errors.industry?.message}
              required
            />
          )}
        />

        <TextField
          label="Correo electrónico"
          type="email"
          icon="mdi-email-outline"
          placeholder="nombre@empresa.com"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register('email')}
        />

        <TextField
          label="Teléfono"
          icon="mdi-phone"
          placeholder="+52 55 1234 5678"
          error={!!errors.phone}
          helperText={errors.phone?.message}
          {...register('phone')}
        />

        <TextField
          label="TAX ID / RFC"
          placeholder="p. ej. NOR920305AB1"
          error={!!errors.taxId}
          helperText={errors.taxId?.message}
          {...register('taxId')}
        />

        <TextField
          label="Nombre para factura"
          placeholder="Razón social completa"
          error={!!errors.invoiceName}
          helperText={errors.invoiceName?.message}
          {...register('invoiceName')}
        />

        <TextField
          label="Sitio web"
          placeholder="https://empresa.com"
          error={!!errors.web}
          helperText={errors.web?.message}
          {...register('web')}
        />

        <Controller
          name="source"
          control={control}
          render={({ field }) => (
            <Select
              label="Fuente de contacto"
              value={field.value ?? ''}
              onChange={field.onChange}
              options={toOptions(catalogs?.sources)}
              placeholder="¿Cómo nos conocieron?"
            />
          )}
        />

        <Controller
          name="association"
          control={control}
          render={({ field }) => (
            <Select
              label="Asociación"
              value={field.value ?? ''}
              onChange={field.onChange}
              options={toOptions(catalogs?.associations)}
              placeholder="Selecciona una asociación"
            />
          )}
        />

        {/* Hidden submit for Enter-key support */}
        <Box sx={{ display: 'none' }}>
          <button type="submit" aria-hidden tabIndex={-1} />
        </Box>
      </Box>
    </Dialog>
  );
}
