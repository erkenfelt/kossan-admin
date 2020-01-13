import { BookingType } from './../firebase/bookable-date.model';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent {
  getMaintenanceName(): string {
    return (new Date().getMonth() > 9 || new Date().getMonth() < 4) ? 'SNÖSKOTTNING' : 'GRÄSKLIPPNING';
  }

  getBookingType(): BookingType {
    return (new Date().getMonth() > 9 || new Date().getMonth() < 4) ? 'shoveling' : 'mowing';
  }
}
