import { SelectableMaintenanceType } from './selectable-maintenance-type.interface';
import { BookingType } from './../../firebase/bookable-date.model';
import { Component, Input } from '@angular/core';
import { MatDatepickerInputEvent, MatDialogRef } from '@angular/material';
import { FirebaseService } from '../../firebase/firebase.service';

@Component({
  selector: 'app-add-maintenance-date',
  templateUrl: './add-maintenance-date.dialog.html',
  styleUrls: ['./add-maintenance-date.dialog.less'],
})
export class AddMaintenanceDateDialog {
  availableSlots = 1;
  date: Date;
  boookingType: BookingType;

  bookingTypes: SelectableMaintenanceType[] = [
    { bookingType: 'mowing', viewValue: 'Gräsklippning' },
    { bookingType: 'shoveling', viewValue: 'Snöskottning' },
  ];

  constructor(
    private readonly firebase: FirebaseService,
    private readonly dialogRef: MatDialogRef<AddMaintenanceDateDialog>,
  ) {}

  onDateChanged(selectedDate: MatDatepickerInputEvent<Date>) {
    this.date = selectedDate.value;
  }

  addDate() {
    const startDate = this.date;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    this.firebase.createDate(startDate, endDate, this.availableSlots, this.boookingType);
    this.dialogRef.close();
  }
}
