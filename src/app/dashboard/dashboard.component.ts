import { BookingType } from './../firebase/bookable-date.model';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent {
  getMaintenanceName(): string {
    return (new Date().getMonth() > 10 || new Date().getMonth() < 3) ? 'SNÖSKOTTNING' : 'GRÄSKLIPPNING';
  }

  getBookingType(): BookingType {
    return (new Date().getMonth() > 10 || new Date().getMonth() < 3) ? 'shoveling' : 'mowing';
  }
}
