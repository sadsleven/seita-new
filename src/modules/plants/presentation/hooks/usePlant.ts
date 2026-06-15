import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { plantsGateway } from '../../infrastructure';
import type { CreateContactInput } from '../../domain/models/Contact';

/** Single-plant queries + contact/history mutations for the detail page. */
export function usePlant(id: number) {
  const qc = useQueryClient();

  const plantQuery = useQuery({
    queryKey: ['plants', id],
    queryFn: () => plantsGateway.getById(id),
    enabled: !!id,
  });

  const contactsQuery = useQuery({
    queryKey: ['plants', id, 'contacts'],
    queryFn: () => plantsGateway.getContacts(id),
    enabled: !!id,
  });

  const historyQuery = useQuery({
    queryKey: ['plants', id, 'history'],
    queryFn: () => plantsGateway.getEventHistory(id),
    enabled: !!id,
  });

  const invalidatePlant = () => {
    void qc.invalidateQueries({ queryKey: ['plants', id] });
    void qc.invalidateQueries({ queryKey: ['plants'] });
  };

  const addContact = useMutation({
    mutationFn: (input: CreateContactInput) => plantsGateway.addContact(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['plants', id, 'contacts'] }),
  });

  const deleteContact = useMutation({
    mutationFn: (contactId: number) => plantsGateway.deleteContact(contactId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['plants', id, 'contacts'] }),
  });

  const duplicate = useMutation({
    mutationFn: () => plantsGateway.duplicate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['plants'] }),
  });

  const remove = useMutation({
    mutationFn: () => plantsGateway.delete(id),
    onSuccess: invalidatePlant,
  });

  return {
    plantQuery,
    contactsQuery,
    historyQuery,
    addContact,
    deleteContact,
    duplicate,
    remove,
  };
}
