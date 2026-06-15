import type { StatusTone } from '@/components/ui';
import type { PackageValidation, RegistrationType } from '../domain/models/EventResources';
import type { VendorEvaluation } from '../domain/models/Logistics';

export const COUNTRIES = ['México', 'Estados Unidos', 'Brasil', 'Chile', 'Perú', 'Canadá'];
export const INDUSTRIES = ['Molinos de Papel', 'Tissue', 'Celulosa', 'Empaque', 'Corrugado'];

export const REG_TYPES: { value: RegistrationType; label: string }[] = [
  { value: 'Attendee', label: 'Asistente' },
  { value: 'Technical Presentation', label: 'Presentación Técnica' },
  { value: 'Table Top', label: 'Mesa' },
  { value: 'Other', label: 'Otro' },
];

export const REG_TYPE_TONE: Record<RegistrationType, StatusTone> = {
  Attendee: 'success',
  'Technical Presentation': 'info',
  'Table Top': 'warning',
  Other: 'neutral',
};

export const CATEGORIES = [
  { value: 'Paper', label: 'Papel' },
  { value: 'Can', label: 'Lata' },
  { value: 'Corr', label: 'Corr' },
];

export const EVALUATIONS: VendorEvaluation[] = ['Excellent', 'Good', 'Regular', 'Deficient'];

export const EVAL_LABEL: Record<VendorEvaluation, string> = {
  Excellent: 'Excelente',
  Good: 'Bueno',
  Regular: 'Regular',
  Deficient: 'Deficiente',
  'No Evaluation': 'Sin evaluación',
};

export const EVAL_TONE: Record<VendorEvaluation, StatusTone> = {
  Excellent: 'success',
  Good: 'info',
  Regular: 'warning',
  Deficient: 'error',
  'No Evaluation': 'neutral',
};

export const PACKAGE_VALIDATION: Record<PackageValidation, { tone: StatusTone; label: string }> = {
  green: { tone: 'success', label: 'Completo' },
  yellow: { tone: 'warning', label: 'Revisar' },
  red: { tone: 'error', label: 'Incompleto' },
};
