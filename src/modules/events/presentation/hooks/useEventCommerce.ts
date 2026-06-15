import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventsGateway } from '../../infrastructure';
import type {
  CreateCampaignInput,
  CreateEventProductInput,
  CreatePackageInput,
  CreateRegistrationInput,
} from '../../domain/models/EventResources';

/** Invalidate everything scoped to an event (detail, stats, sub-resources) + the list. */
function useEventInvalidator(eventId: number) {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ['events', eventId] });
    qc.invalidateQueries({ queryKey: ['events'] });
  };
}

export function useRegistrations(eventId: number) {
  const invalidate = useEventInvalidator(eventId);
  const query = useQuery({
    queryKey: ['events', eventId, 'registrations'],
    queryFn: () => eventsGateway.getRegistrations(eventId),
  });
  const plants = useQuery({
    queryKey: ['registrable-plants'],
    queryFn: () => eventsGateway.getRegistrablePlants(),
  });
  const add = useMutation({
    mutationFn: (input: CreateRegistrationInput) => eventsGateway.addRegistration(eventId, input),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: number) => eventsGateway.deleteRegistration(id),
    onSuccess: invalidate,
  });
  return { query, plants, add, remove };
}

export function useEventProducts(eventId: number) {
  const invalidate = useEventInvalidator(eventId);
  const query = useQuery({
    queryKey: ['events', eventId, 'products'],
    queryFn: () => eventsGateway.getProducts(eventId),
  });
  const add = useMutation({
    mutationFn: (input: CreateEventProductInput) => eventsGateway.addProduct(eventId, input),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: number) => eventsGateway.deleteProduct(id),
    onSuccess: invalidate,
  });
  return { query, add, remove };
}

export function usePackages(eventId: number) {
  const invalidate = useEventInvalidator(eventId);
  const query = useQuery({
    queryKey: ['events', eventId, 'packages'],
    queryFn: () => eventsGateway.getPackages(eventId),
  });
  const add = useMutation({
    mutationFn: (input: CreatePackageInput) => eventsGateway.addPackage(eventId, input),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: number) => eventsGateway.deletePackage(id),
    onSuccess: invalidate,
  });
  return { query, add, remove };
}

export function useCampaigns(eventId: number) {
  const invalidate = useEventInvalidator(eventId);
  const query = useQuery({
    queryKey: ['events', eventId, 'campaigns'],
    queryFn: () => eventsGateway.getCampaigns(eventId),
  });
  const add = useMutation({
    mutationFn: (input: CreateCampaignInput) => eventsGateway.addCampaign(eventId, input),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: number) => eventsGateway.deleteCampaign(id),
    onSuccess: invalidate,
  });
  return { query, add, remove };
}

export function useInvoices(eventId: number) {
  const invoices = useQuery({
    queryKey: ['events', eventId, 'invoices'],
    queryFn: () => eventsGateway.getInvoices(eventId),
  });
  const templates = useQuery({
    queryKey: ['invoice-templates'],
    queryFn: () => eventsGateway.getInvoiceTemplates(),
  });
  return { invoices, templates };
}
