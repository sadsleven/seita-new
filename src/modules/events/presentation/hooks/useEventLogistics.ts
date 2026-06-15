import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventsGateway } from '../../infrastructure';
import type { CreateHotelInput, CreateVendorInput, RoomStatusField, VendorEvaluation } from '../../domain/models/Logistics';

function useEventInvalidator(eventId: number) {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ['events', eventId] });
    qc.invalidateQueries({ queryKey: ['nights'] });
  };
}

export function useRooming(eventId: number) {
  const invalidate = useEventInvalidator(eventId);
  const query = useQuery({
    queryKey: ['events', eventId, 'rooming'],
    queryFn: () => eventsGateway.getRooming(eventId),
  });
  const setStatus = useMutation({
    mutationFn: ({ id, field }: { id: number; field: RoomStatusField }) =>
      eventsGateway.setRoomStatus(id, field),
    onSuccess: invalidate,
  });
  return { query, setStatus };
}

export function useHotels(eventId: number) {
  const invalidate = useEventInvalidator(eventId);
  const query = useQuery({
    queryKey: ['events', eventId, 'hotels'],
    queryFn: () => eventsGateway.getHotels(eventId),
  });
  const nights = useQuery({ queryKey: ['nights'], queryFn: () => eventsGateway.getNights() });
  const add = useMutation({
    mutationFn: (input: CreateHotelInput) => eventsGateway.addHotel(eventId, input),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: number) => eventsGateway.deleteHotel(id),
    onSuccess: invalidate,
  });
  return { query, nights, add, remove };
}

export function useVendors(eventId: number) {
  const invalidate = useEventInvalidator(eventId);
  const query = useQuery({
    queryKey: ['events', eventId, 'vendors'],
    queryFn: () => eventsGateway.getVendors(eventId),
  });
  const add = useMutation({
    mutationFn: (input: CreateVendorInput) => eventsGateway.addVendor(eventId, input),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: number) => eventsGateway.deleteVendor(id),
    onSuccess: invalidate,
  });
  const evaluate = useMutation({
    mutationFn: ({ id, evaluation, observation }: { id: number; evaluation: VendorEvaluation; observation: string }) =>
      eventsGateway.setVendorEvaluation(id, evaluation, observation),
    onSuccess: invalidate,
  });
  return { query, add, remove, evaluate };
}
