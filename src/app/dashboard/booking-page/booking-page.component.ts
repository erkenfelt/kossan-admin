import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from './../../auth/user.model';
import { FirebaseService } from './../../firebase/firebase.service';
import { AuthService } from './../../auth/auth.service';
import { CalculatedQuota } from './../../firebase/calculated-quota.model';
import { Booking } from './../../firebase/booking.model';
import { BookableDate, BookingType } from './../../firebase/bookable-date.model';
import { Account } from '../../firebase/account.model';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.less'],
})
export class BookingPageComponent implements OnInit {
  @Input() bookingType: BookingType;

  dates: Observable<BookableDate[]>;
  bookings: Observable<Booking[]>;
  quota: Observable<CalculatedQuota>;
  user: User;

  constructor(private readonly auth: AuthService, private readonly firebase: FirebaseService) {}

  ngOnInit() {
    this.dates = this.firebase
      .allDates()
      .pipe(
        map(dates =>
          dates.filter(
            date =>
              date.type === this.bookingType &&
              this.getDate(date.end.seconds) > new Date(Date.now()),
          ),
        ),
      );
    this.user = this.auth.getCurrentUser();
    this.bookings = this.firebase
      .bookingsByAccount(this.user.accountId)
      .pipe(map(bookings => bookings.filter(booking => booking.type === this.bookingType)));
    this.quota = this.firebase.participationQuota(this.user.accountId, this.bookingType);
  }

  getReadableDate(date: BookableDate | Booking): string {
    return this.firebase.getReadableDate(date);
  }

  getBookings(dateId: string): Observable<Booking[]> {
    return this.firebase
      .bookingsByDate(dateId)
      .pipe(map(bookings => bookings.filter(booking => booking.type === this.bookingType)));
  }

  getAccount(accountId: string): Observable<Account> {
    return this.firebase.account(accountId);
  }

  bookDate(date: BookableDate) {
    this.firebase.createBooking(date, this.user.accountId);
  }

  notBooked(accounts: Account[]) {
    return accounts.find(a => a.id === this.user.accountId) === undefined;
  }

  canCancelBooking(booking: Booking): boolean {
    const startDate = this.getDate(booking.start.seconds);
    return startDate >= this.oneWeekFromNow();
  }

  cancelBooking(booking: Booking) {
    this.firebase.deleteBooking(booking);
  }

  hasPassed(booking: Booking): boolean {
    return this.getDate(booking.start.seconds) < new Date();
  }

  getDate(seconds: number): Date {
    return new Date(seconds * 1000);
  }

  private oneWeekFromNow(): Date {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
}
