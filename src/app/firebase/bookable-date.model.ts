import { Timestamp } from './timestamp.model';
import { Account } from './account.model';

export type BookingType = 'participation' | 'mowing' | 'shoveling' | 'fixing';

export interface BookableDate {
  readonly id: string;
  readonly availableSlots: number;
  readonly nbrOfSlots: number;
  readonly bookings: Array<Account>;
  readonly end: Timestamp;
  readonly start: Timestamp;
  readonly type: BookingType;
  readonly description?: string;
}
