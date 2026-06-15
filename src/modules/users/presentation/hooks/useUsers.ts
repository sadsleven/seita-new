import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersGateway } from '../../infrastructure';
import type { CreateUserInput, UserStatus } from '../../domain/models/AdminUser';

const USERS_KEY = ['users'];

export function useUsers() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: USERS_KEY,
    queryFn: () => usersGateway.list(),
  });

  const create = useMutation({
    mutationFn: (input: CreateUserInput) => usersGateway.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => usersGateway.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  });

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: UserStatus }) =>
      usersGateway.setStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  });

  return { query, create, remove, setStatus };
}
