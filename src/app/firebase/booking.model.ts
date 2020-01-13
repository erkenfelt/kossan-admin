import { Timestamp } from './timestamp.model';
import { BookingType } from './bookable-date.model';

export interface Booking {
  readonly id?: string;
  readonly accountId: string;
  readonly dateId: string;
  readonly end: Timestamp;
  readonly start: Timestamp;
  readonly type: BookingType;
}
