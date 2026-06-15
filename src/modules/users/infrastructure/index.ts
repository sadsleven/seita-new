import { isStorageMode } from '@/lib';
import type { UsersGateway } from '../domain/usersGateway';
import { UsersStorageGateway } from './usersStorageGateway';
import { UsersHttpGateway } from './usersHttpGateway';

/** Gateway binding: localStorage for the demo, HTTP for production. */
export const usersGateway: UsersGateway = isStorageMode
  ? new UsersStorageGateway()
  : new UsersHttpGateway();
