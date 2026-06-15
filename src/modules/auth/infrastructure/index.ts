import { isStorageMode } from '@/lib';
import type { AuthGateway } from '../domain/authGateway';
import { AuthStorageGateway } from './authStorageGateway';
import { AuthHttpGateway } from './authHttpGateway';

/** Gateway binding: localStorage for the demo, HTTP for production. */
export const authGateway: AuthGateway = isStorageMode
  ? new AuthStorageGateway()
  : new AuthHttpGateway();
