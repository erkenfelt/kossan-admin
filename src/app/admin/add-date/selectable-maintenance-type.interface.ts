import { BookingType } from './../../firebase/bookable-date.model';

export interface SelectableMaintenanceType {
  readonly bookingType: BookingType;
  readonly viewValue: string;
}
