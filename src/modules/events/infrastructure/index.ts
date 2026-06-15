import { isStorageMode } from '@/lib';
import type { EventsGateway } from '../domain/eventsGateway';
import { EventsStorageGateway } from './eventsStorageGateway';
import { EventsHttpGateway } from './eventsHttpGateway';

export const eventsGateway: EventsGateway = isStorageMode
  ? new EventsStorageGateway()
  : new EventsHttpGateway();
