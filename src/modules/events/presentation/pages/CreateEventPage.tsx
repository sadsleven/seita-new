import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import { Button, Card, DataTable, IconButton, Select, TextField } from '@/components/ui';
import { addDays } from '@/lib';
import { useEvents } from '../hooks/useEvents';
import { useHotels } from '../hooks/useEventLogistics';
import { COUNTRIES, INDUSTRIES } from '../constants';
import type { Hotel } from '../../domain/models/Logistics';

function Stepper({ step }: { step: number }) {
  const steps = [
    { n: 1, label: 'Información del evento' },
    { n: 2, label: 'Hoteles' },
  ];
  return (
    <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
      {steps.map((s, i) => (
        <Box key={s.n} sx={{ display: 'contents' }}>
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                bgcolor: step >= s.n ? 'primary.main' : 'var(--neutral-200)',
                color: step >= s.n ? '#fff' : 'text.secondary',
              }}
            >
              {step > s.n ? <span className="mdi mdi-check" aria-hidden /> : s.n}
            </Box>
            <Typography sx={{ fontWeight: 700, color: step >= s.n ? 'text.primary' : 'text.secondary' }}>
              {s.label}
            </Typography>
          </Stack>
          {i === 0 && (
            <Box sx={{ flex: 1, height: 3, mx: 2, borderRadius: 1, bgcolor: step > 1 ? 'primary.main' : 'var(--neutral-200)' }} />
          )}
        </Box>
      ))}
    </Stack>
  );
}

const schema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  billingPrefix: z.string().min(1, 'El prefijo es obligatorio'),
  billCounter: z.string().min(1, 'El contador es obligatorio'),
  country: z.string().min(1, 'Elige un país'),
  address: z.string().min(1, 'La sede es obligatoria'),
  numberOfNights: z.coerce.number().min(0),
  numberMakers: z.coerce.number().min(0),
  startDate: z.string().min(1, 'Elige una fecha'),
  endDate: z.string().min(1, 'Elige una fecha'),
  industries: z.array(z.string()).min(1, 'Selecciona al menos una industria'),
});

type FormValues = z.infer<typeof schema>;

function HotelsStep({ eventId, onBack, onFinish }: { eventId: number; onBack: () => void; onFinish: () => void }) {
  const { query, add, remove } = useHotels(eventId);
  const [form, setForm] = useState({ name: '', priority: 1, total: 0, double: 0 });
  const single = Math.max(0, (Number(form.total) || 0) - (Number(form.double) || 0));
  const hotels = query.data ?? [];

  const addHotel = () => {
    if (!form.name || !form.total) return;
    add.mutate(
      { name: form.name, priority: Number(form.priority), single, double: Number(form.double) || 0 },
      { onSuccess: () => setForm({ name: '', priority: hotels.length + 2, total: 0, double: 0 }) },
    );
  };

  return (
    <Box>
      <Typography variant="h4" color="text.secondary" sx={{ mb: 2 }}>
        Información de hoteles
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr 1fr' }, gap: 1.75, alignItems: 'flex-end' }}>
        <TextField label="Hotel" placeholder="Nombre del hotel" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <TextField label="Prioridad" type="number" value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: Number(e.target.value) }))} />
        <TextField label="Total" type="number" value={form.total} onChange={(e) => setForm((f) => ({ ...f, total: Number(e.target.value) }))} />
        <TextField label="Dobles" type="number" value={form.double} onChange={(e) => setForm((f) => ({ ...f, double: Number(e.target.value) }))} />
      </Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 1.5, flexWrap: 'wrap' }}>
        <Typography color="text.secondary">
          Sencillas (auto): <strong style={{ color: 'var(--text-strong)' }}>{single}</strong>
        </Typography>
        <Button size="sm" variant="outlined" icon="mdi-plus" onClick={addHotel} disabled={!form.name || !form.total} loading={add.isPending}>
          Agregar Hotel
        </Button>
      </Stack>
      <Box sx={{ mt: 2.5 }}>
        <DataTable<Hotel>
          rows={hotels}
          rowKey="id"
          emptyText="No hay hoteles para mostrar."
          columns={[
            { key: 'name', header: 'Hotel', align: 'left', render: (r) => <strong>{r.name}</strong> },
            { key: 'priority', header: 'Prioridad' },
            { key: 'single', header: 'Sencillas' },
            { key: 'double', header: 'Dobles' },
            { key: 'rooms', header: 'Habitaciones', render: (r) => <strong>{r.rooms}</strong> },
            { key: 'nights', header: 'Noches' },
            {
              key: 'actions',
              header: 'Acción',
              render: (r) => <IconButton label="Eliminar hotel" icon="mdi-delete" color="danger" size="small" onClick={() => remove.mutate(r.id)} />,
            },
          ]}
        />
      </Box>
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
        <Button variant="text" icon="mdi-arrow-left" onClick={onBack}>
          Atrás
        </Button>
        <Button color="success" icon="mdi-check" onClick={onFinish}>
          Finalizar
        </Button>
      </Stack>
    </Box>
  );
}

export function CreateEventPage() {
  const navigate = useNavigate();
  const { create } = useEvents();
  const [step, setStep] = useState(1);
  const [newId, setNewId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      billingPrefix: '',
      billCounter: '1000',
      country: '',
      address: '',
      numberOfNights: 3,
      numberMakers: 0,
      startDate: addDays(30),
      endDate: addDays(33),
      industries: [],
    },
  });

  const onSubmitStep1 = async (values: FormValues) => {
    const id = await create.mutateAsync(values);
    setNewId(id);
    setStep(2);
  };

  return (
    <Box sx={{ maxWidth: 860, mx: 'auto' }}>
      <Button variant="text" icon="mdi-arrow-left" onClick={() => navigate('/eventos')} sx={{ mb: 2 }}>
        Volver a Eventos
      </Button>
      <Card>
        <Typography variant="h2" component="h1" sx={{ mb: 0.5 }}>
          Crear Evento
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Los campos marcados con <Box component="span" sx={{ color: 'error.main', fontWeight: 700 }}>*</Box> son obligatorios.
        </Typography>
        <Stepper step={step} />
        <Box sx={{ height: 1, bgcolor: 'var(--border-subtle)', my: 3 }} />

        {step === 1 ? (
          <Box component="form" onSubmit={handleSubmit(onSubmitStep1)} noValidate>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box sx={{ gridColumn: '1 / -1' }}>
                <TextField label="Nombre" placeholder="Nombre del evento" required error={!!errors.name} helperText={errors.name?.message} {...register('name')} />
              </Box>
              <TextField label="Prefijo de factura" placeholder="p. ej. LATAM" required error={!!errors.billingPrefix} helperText={errors.billingPrefix?.message} {...register('billingPrefix')} />
              <TextField label="Contador de factura" type="number" required error={!!errors.billCounter} helperText={errors.billCounter?.message} {...register('billCounter')} />
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select
                    label="País"
                    placeholder="Selecciona un país"
                    value={field.value}
                    onChange={field.onChange}
                    options={COUNTRIES.map((c) => ({ value: c, label: c }))}
                    required
                    error={!!errors.country}
                    helperText={errors.country?.message}
                  />
                )}
              />
              <TextField label="Sede" icon="mdi-map-marker" placeholder="Hotel / centro de convenciones" required error={!!errors.address} helperText={errors.address?.message} {...register('address')} />
              <TextField label="Noches por persona" type="number" {...register('numberOfNights')} />
              <TextField label="Cuotas sin cargo (makers)" type="number" {...register('numberMakers')} />
              <TextField label="Fecha de inicio" type="date" required error={!!errors.startDate} helperText={errors.startDate?.message} {...register('startDate')} />
              <TextField label="Fecha de fin" type="date" required error={!!errors.endDate} helperText={errors.endDate?.message} {...register('endDate')} />

              <Box sx={{ gridColumn: '1 / -1' }}>
                <Typography sx={{ fontWeight: 700, mb: 1 }}>
                  Industrias <Box component="span" sx={{ color: 'error.main' }}>*</Box>
                </Typography>
                <Controller
                  name="industries"
                  control={control}
                  render={({ field }) => (
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {INDUSTRIES.map((it) => {
                        const on = field.value.includes(it);
                        return (
                          <Box
                            key={it}
                            component="button"
                            type="button"
                            onClick={() =>
                              field.onChange(on ? field.value.filter((x) => x !== it) : [...field.value, it])
                            }
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.75,
                              border: `2px solid ${on ? 'var(--primary-500)' : 'var(--border-default)'}`,
                              bgcolor: on ? 'brand.soft' : 'background.paper',
                              color: on ? 'primary.dark' : 'text.primary',
                              cursor: 'pointer',
                              borderRadius: 999,
                              px: 2,
                              py: 1,
                              fontFamily: 'var(--font-sans)',
                              fontSize: '0.9375rem',
                              fontWeight: 700,
                            }}
                          >
                            <span className={`mdi ${on ? 'mdi-check-circle' : 'mdi-plus-circle-outline'}`} aria-hidden style={{ fontSize: '1.2rem' }} />
                            {it}
                          </Box>
                        );
                      })}
                    </Stack>
                  )}
                />
                {errors.industries && (
                  <Typography sx={{ color: 'error.main', fontSize: '0.8125rem', fontWeight: 700, mt: 0.75 }}>
                    {errors.industries.message}
                  </Typography>
                )}
              </Box>

              <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
                <Button variant="outlined" onClick={() => navigate('/eventos')}>
                  Cancelar
                </Button>
                <Button type="submit" trailingIcon="mdi-arrow-right" loading={create.isPending}>
                  Continuar
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          newId !== null && <HotelsStep eventId={newId} onBack={() => setStep(1)} onFinish={() => navigate(`/eventos/${newId}`)} />
        )}
      </Card>
    </Box>
  );
}
