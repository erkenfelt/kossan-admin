import { BookingType } from '../../firebase/bookable-date.model';
import { Component, Input } from '@angular/core';
import { SelectableTime } from './selectable-time.interface';
import { MatDatepickerInputEvent, MatDialogRef } from '@angular/material';
import { FirebaseService } from '../../firebase/firebase.service';

@Component({
  selector: 'app-add-participation-date',
  templateUrl: './add-participation-date.dialog.html',
  styleUrls: ['./add-participation-date.dialog.less'],
})
export class AddParticipationDateDialog {

  times: SelectableTime[] = [
    { index: 0, viewValue: '08:00', hours: 8, minutes: 0 },
    { index: 1, viewValue: '09:00', hours: 9, minutes: 0 },
    { index: 2, viewValue: '10:00', hours: 10, minutes: 0 },
    { index: 3, viewValue: '11:00', hours: 11, minutes: 0 },
    { index: 4, viewValue: '12:00', hours: 12, minutes: 0 },
    { index: 5, viewValue: '12:30', hours: 12, minutes: 30 },
    { index: 6, viewValue: '13:00', hours: 13, minutes: 0 },
    { index: 7, viewValue: '13:30', hours: 13, minutes: 30 },
    { index: 8, viewValue: '14:00', hours: 14, minutes: 0 },
    { index: 9, viewValue: '14:30', hours: 14, minutes: 30 },
    { index: 10, viewValue: '15:00', hours: 15, minutes: 0 },
    { index: 11, viewValue: '15:30', hours: 15, minutes: 30 },
    { index: 12, viewValue: '16:00', hours: 16, minutes: 0 },
    { index: 13, viewValue: '16:30', hours: 16, minutes: 30 },
    { index: 14, viewValue: '17:00', hours: 17, minutes: 0 },
    { index: 15, viewValue: '17:30', hours: 17, minutes: 30 },
  ];

  startTime = 10;
  endTime = 14;
  availableSlots = 3;
  date: Date;

  constructor(
    private readonly firebase: FirebaseService,
    private readonly dialogRef: MatDialogRef<AddParticipationDateDialog>,
  ) {}

  onDateChanged(selectedDate: MatDatepickerInputEvent<Date>) {
    this.date = selectedDate.value;
  }

  addDate() {
    const startDate = new Date(this.date.setHours(this.times[this.startTime].hours, this.times[this.startTime].minutes));
    const endDate = new Date(this.date.setHours(this.times[this.endTime].hours, this.times[this.endTime].minutes));
    this.firebase.createDate(startDate, endDate, this.availableSlots, 'participation');
    this.dialogRef.close();
  }
}
