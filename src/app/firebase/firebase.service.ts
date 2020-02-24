import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore,
} from 'angularfire2/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account, ParticipationType } from './account.model';
import { User } from '../auth/user.model';
import { BookableDate, BookingType } from './bookable-date.model';
import {
  secondsToDateString,
  dateToDayAndTime,
  dateToTime,
  dateToDay,
} from '../converters/date.converters';
import { Booking } from './booking.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { CalculatedQuota } from './calculated-quota.model';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class FirebaseService {
  constructor(
    private readonly afs: AngularFirestore,
    private readonly afAuth: AngularFireAuth,
    private authService: AuthService,
  ) {}

  // ACCOUNTS
  createAccount(name: string, participation: ParticipationType) {
    this.log(`created account with name ${name} and participation ${participation}`);
    const accountsRef = this.afs.collection('accounts');
    accountsRef.add({ displayName: name, participation });
  }

  allAccounts(): Observable<Account[]> {
    const accountsRef = this.afs.collection<Account>('accounts', ref =>
      ref.orderBy('displayName', 'asc'),
    );
    return this.collectionChanges<Account>(accountsRef);
  }

  account(accountId: string): Observable<Account> {
    const accountRef = this.afs.collection('accounts').doc<Account>(accountId);
    return this.documentChanges<Account>(accountRef);
  }

  updateAccount(accountId: string, name: string, participation: ParticipationType) {
    this.log(`updated account name to ${name} and participation to ${participation}`);
    const accountRef = this.afs.collection('accounts').doc(accountId);
    accountRef.update({ displayName: name, participation });
  }

  async deleteAccount(accountId: string) {
    this.log(`deleted account with id ${accountId}`);
    const accountRef = this.afs.collection('accounts').doc(accountId);
    accountRef.delete();

    // BOOKINGS SHOULD ALSO BE DELETED BUT DOES NOT WORK
    // const bookingsQry = this.afs
    //   .collection('bookings', ref => ref.where('accountId', '==', accountId));
    // bookingsQry.ref.get().
    // const batch = this.afs.firestore.batch();
    // bookingsQry.forEach(doc => {
    //   batch.delete(doc.ref);
    // });

    // batch.commit();
  }

  // USERS
  async createUser(name: string, email: string, accountId: string) {
    this.log(`added user ${name} to account ${accountId}`);
    const credential = await this.afAuth.auth.createUserWithEmailAndPassword(email, 'password');
    const uid = credential.user.uid;
    const usersRef = this.afs.collection('users');
    usersRef.add({
      uid,
      name,
      email,
      accountId,
      admin: false,
    });
  }

  users(accountId: string): Observable<User[]> {
    const usersRef = this.afs.collection<User>('users', ref =>
      ref.where('accountId', '==', accountId),
    );
    return this.collectionChanges(usersRef);
  }

  updateUserRole(userId: string, isAdmin: boolean) {
    this.log(`updated user to` + isAdmin ? 'admin account' : 'regular account');
    const userRef = this.afs.collection('users').doc(userId);
    userRef.update({
      admin: isAdmin,
    });
  }

  deleteUser(userId: string) {
    this.log(`deleted user with id ${userId}`);
    const userRef = this.afs.collection('users').doc(userId);
    userRef.delete();
  }

  // DATES
  createDateWithDescription(start: Date, end: Date, availableSlots: number, bookingType: BookingType, description: string) {
    this.log(`created date with start ${dateToDayAndTime(start)}`);
    const datesRef = this.afs.collection('dates');
    datesRef.add({
      start,
      end,
      availableSlots,
      nbrOfSlots: availableSlots,
      type: bookingType,
      description,
    });
  }

  createDate(start: Date, end: Date, availableSlots: number, bookingType: BookingType) {
    this.log(`created date with start ${dateToDayAndTime(start)}`);
    const datesRef = this.afs.collection('dates');
    datesRef.add({
      start,
      end,
      availableSlots,
      nbrOfSlots: availableSlots,
      type: bookingType,
    });
  }

  allDates(): Observable<BookableDate[]> {
    const datesRef = this.afs.collection<BookableDate>('dates', ref => ref.orderBy('start', 'asc'));
    return combineLatest(
      this.collectionChanges(datesRef),
      this.allBookings(),
      this.allAccounts(),
    ).pipe(
      map(datesAndBookingsAndAccounts => {
        const dates = datesAndBookingsAndAccounts[0];
        const bookings = datesAndBookingsAndAccounts[1];
        const accounts = datesAndBookingsAndAccounts[2];
        const datesWithBookings = [];

        for (const date of dates) {
          const dateBookings = bookings.filter(booking => booking.dateId === date.id);
          const bookedByList = [];
          for (const booking of dateBookings) {
            const account = accounts.find(a => a.id === booking.accountId);
            bookedByList.push(account);
          }
          datesWithBookings.push({ ...date, bookings: bookedByList });
        }

        return datesWithBookings;
      }),
    );
  }

  async deleteDate(dateId: string) {
    this.log(`deleted date with id ${dateId}`);
    const dateRef = this.afs.collection('dates').doc(dateId);
    dateRef.delete();

    // BOOKINGS SHOULD ALSO BE DELETED BUT DOES NOT WORK
    // Delete bookings
    // const bookingsQry = await this.afs
    //   .collection('bookings', ref => ref.where('dateId', '==', dateId))
    //   .ref.get();
    // const batch = this.afs.firestore.batch();
    // bookingsQry.forEach(doc => {
    //   batch.delete(doc.ref);
    // });

    // batch.commit();
  }

  // BOOKINGS
  createBooking(date: BookableDate, accountId: string) {
    this.log(`booked participation for ${this.getReadableDate(date)}`);
    const bookingsRef = this.afs.collection(`bookings`, ref =>
      ref.where('accountId', '==', accountId),
    );
    bookingsRef.add({
      dateId: date.id,
      start: date.start,
      accountId,
      end: date.end,
      type: date.type,
    });

    const bookableDateDocRef = this.afs.doc(`dates/${date.id}`);
    bookableDateDocRef.update({
      availableSlots: date.availableSlots - 1,
    });
  }

  allBookings(): Observable<Booking[]> {
    const bookingsRef = this.afs.collection<Booking>(`bookings`);
    return this.collectionChanges(bookingsRef);
  }

  bookingsByAccount(accountId: string): Observable<Booking[]> {
    const bookingsRef = this.afs.collection<Booking>(`bookings`, ref =>
      ref.where('accountId', '==', accountId).orderBy('start', 'asc'),
    );
    return this.collectionChanges(bookingsRef);
  }

  bookingsByDate(dateId: string): Observable<Booking[]> {
    const bookingsRef = this.afs.collection<Booking>(`bookings`, ref =>
      ref.where('dateId', '==', dateId),
    );
    return this.collectionChanges(bookingsRef);
  }

  booking(bookingId: string): Observable<Booking> {
    const bookingRef = this.afs.collection(`bookings`).doc<Booking>(bookingId);
    return this.documentChanges(bookingRef);
  }

  async deleteBooking(booking: Booking) {
    this.log(`canceled participation for ${this.getReadableDate(booking)}`);
    const bookingDocRef = this.afs.collection('bookings').doc(booking.id);
    bookingDocRef.delete();

    const bookableDate = await this.afs
      .doc(`dates/${booking.dateId}`)
      .ref.get()
      .then(doc => doc.data() as BookableDate);

    const bookableDateDocRef = this.afs.doc(`dates/${booking.dateId}`);
    bookableDateDocRef.update({
      availableSlots: bookableDate.availableSlots + 1,
    });
  }

  // CALCULATING PARTICIPATION QUOTA
  participationQuota(accountId: string, bookingType: BookingType): Observable<CalculatedQuota> {
    const datesRef = this.afs.collection<BookableDate>('dates', ref =>
      ref.where('type', '==', bookingType),
    );
    return combineLatest(
      this.collectionChanges(datesRef),
      this.allAccounts(),
      this.bookingsByAccount(accountId).pipe(
        map(bookings => bookings.filter(booking => booking.type === bookingType)),
      ),
    ).pipe(
      map(datesAndAccountsAndBookings => {
        const dates = datesAndAccountsAndBookings[0];
        const accounts = datesAndAccountsAndBookings[1];
        const bookings = datesAndAccountsAndBookings[2];
        const nbrOfSlots = dates.map(d => d.nbrOfSlots).reduce((a, b) => a + b, 0);
        const slotsPerAccounts = Math.ceil(
          nbrOfSlots / accounts.filter(a => a.participation !== 'no').length,
        );

        if (bookingType === 'participation') {
          let slotsPerLimitedAccount = Math.ceil(slotsPerAccounts / 1.9);
          const slotsPerSemiFullAccount = Math.ceil(slotsPerAccounts / 1.4);
          const nbrOfLimitedAccounts = accounts.filter(a => a.participation === 'limited').length;
          const nbrOfSemiFullAccounts = accounts.filter(a => a.participation === 'semi-full').length;
          const nbrOfRegularAccounts = accounts.filter(a => a.participation === 'full').length;
          let slotsLeft =
            nbrOfSlots - (slotsPerLimitedAccount * nbrOfLimitedAccounts) - (slotsPerSemiFullAccount * nbrOfSemiFullAccounts);
          let slotsPerRegularAccount = Math.ceil(slotsLeft / nbrOfRegularAccounts);
          while (slotsPerRegularAccount / 2 > slotsPerLimitedAccount) {
            slotsLeft =
              nbrOfSlots - (slotsPerLimitedAccount * nbrOfLimitedAccounts) - (slotsPerSemiFullAccount * nbrOfSemiFullAccounts);
            slotsPerRegularAccount = Math.ceil(slotsLeft / nbrOfRegularAccounts);
            slotsPerLimitedAccount++;
          }

          const currentAccount = accounts.find(a => a.id === accountId);
          const expectedCount =
            currentAccount.participation === 'full'
              ? slotsPerRegularAccount
              : currentAccount.participation === 'limited'
              ? slotsPerLimitedAccount
              : currentAccount.participation === 'semi-full'
              ? slotsPerSemiFullAccount
              : 0;
          return { bookedCount: bookings.length, expectedCount };
        } else {
          return { bookedCount: bookings.length, expectedCount: slotsPerAccounts };
        }
      }),
    );
  }

  // CALCULATING PARTICIPATION QUOTA
  participationQuotaForAllAccounts(): Observable<ReadonlyArray<Account & CalculatedQuota>> {
    const datesRef = this.afs.collection<BookableDate>('dates', ref =>
      ref.where('type', '==', 'participation'),
    );
    return combineLatest(
      this.collectionChanges(datesRef),
      this.allAccounts(),
      this.allBookings(),
    ).pipe(
      map(datesAndAccountsAndBookings => {
        const dates = datesAndAccountsAndBookings[0];
        const accounts = datesAndAccountsAndBookings[1];
        const bookings = datesAndAccountsAndBookings[2];

        const nbrOfSlots = dates.map(d => d.nbrOfSlots).reduce((a, b) => a + b, 0);
        const slotsPerAccounts = Math.ceil(
          nbrOfSlots / accounts.filter(a => a.participation !== 'no').length,
        );
        let slotsPerLimitedAccount = Math.ceil(slotsPerAccounts / 1.9);
        const slotsPerSemiFullAccount = Math.ceil(slotsPerAccounts / 1.4);
        const nbrOfLimitedAccounts = accounts.filter(a => a.participation === 'limited').length;
        const nbrOfSemiFullAccounts = accounts.filter(a => a.participation === 'semi-full').length;
        const nbrOfRegularAccounts = accounts.filter(a => a.participation === 'full').length;

        let slotsLeft =
          nbrOfSlots - (slotsPerLimitedAccount * nbrOfLimitedAccounts) - (slotsPerSemiFullAccount * nbrOfSemiFullAccounts);
        let slotsPerRegularAccount = Math.ceil(slotsLeft / nbrOfRegularAccounts);

        while (slotsPerRegularAccount / 2 > slotsPerLimitedAccount) {
          slotsLeft =
            nbrOfSlots - (slotsPerLimitedAccount * nbrOfLimitedAccounts) - (slotsPerSemiFullAccount * nbrOfSemiFullAccounts);
          slotsPerRegularAccount = Math.ceil(slotsLeft / nbrOfRegularAccounts);
          slotsPerLimitedAccount++;
        }

        const accountAndQuota = new Array<Account & CalculatedQuota>();

        for (const account of accounts) {
          const bookedCount = bookings.filter(b => b.accountId === account.id && b.type === 'participation').length;
          const expectedCount =
          account.participation === 'full'
            ? slotsPerRegularAccount
            : account.participation === 'limited'
            ? slotsPerLimitedAccount
            : account.participation === 'semi-full'
            ? slotsPerSemiFullAccount
            : 0;
          accountAndQuota.push({ ...account, expectedCount, bookedCount });
        }

        return accountAndQuota;
      }),
    );
  }

  // HELPER METHODS
  collectionChanges<T>(
    ref: AngularFirestoreCollection<T> | AngularFirestoreDocument<T>,
  ): Observable<T[]> {
    return ref.snapshotChanges().pipe(
      map(actions => {
        return actions.map(snapshot => {
          const data = snapshot.payload.doc.data();
          const id = snapshot.payload.doc.id;
          return { id, ...data };
        });
      }),
    );
  }

  documentChanges<T>(
    ref: AngularFirestoreCollection<T> | AngularFirestoreDocument<T>,
  ): Observable<T> {
    return ref.snapshotChanges().pipe(
      map(actions => {
        return actions.map(snapshot => {
          const data = snapshot.payload.doc.data();
          const id = snapshot.payload.doc.id;
          return { id, ...data };
        });
      }),
    );
  }

  getReadableDate(date: BookableDate | Booking): string {
    if (date.end.seconds - date.start.seconds > 30000) {
      return `${dateToDay(date.start.seconds)}\xa0-\xa0${dateToDay(date.end.seconds)}`;
    }
    // \xa0 is a non breaking space
    return `${secondsToDateString(date.start.seconds)}\xa0-\xa0${dateToTime(date.end.seconds)}`;
  }

  // AUDIT LOG
  private log(message: string) {
    const name = this.authService.getCurrentUser().name;
    const auditRef = this.afs.collection(`audit`);
    auditRef.add({
      name,
      message,
      time: new Date(Date.now()),
    });
  }
}
