import { BookingType } from './../firebase/bookable-date.model';
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { Observable } from 'rxjs';
import { Account } from '../firebase/account.model';
import { MatDialog } from '@angular/material';
import { AddAccountDialog } from './add-account/add-account.dialog';
import { EditAccountDialog } from './edit-account/edit-account.dialog';
import { AccountUsersDialog } from './account-users/account-users.dialog';
import { BookableDate } from '../firebase/bookable-date.model';
import { AddParticipationDateDialog } from './add-date/add-participation-date.dialog';
import { CalculatedQuota } from '../firebase/calculated-quota.model';
import { AddMaintenanceDateDialog } from './add-date/add-maintenance-date.dialog';
import { AddFixingDateDialog } from './add-date/add-fixing-date.dialog';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less'],
})
export class AdminComponent implements OnInit {
  accounts: Observable<Account[]>;
  participationQuotas: Observable<ReadonlyArray<Account & CalculatedQuota>>;
  dates: Observable<BookableDate[]>;
  constructor(public readonly firebase: FirebaseService, private readonly dialog: MatDialog) {}

  ngOnInit() {
    this.accounts = this.firebase.allAccounts();
    this.participationQuotas = this.firebase.participationQuotaForAllAccounts();
    this.dates = this.firebase.allDates();
  }

  addAccount() {
    this.dialog.open(AddAccountDialog, {
      width: '360px',
    });
  }

  editAccount(account: Account) {
    this.dialog.open(EditAccountDialog, {
      width: '360px',
      data: account,
    });
  }

  deleteAccount(account: Account) {
    this.firebase.deleteAccount(account.id);
  }

  accountUsers(account: Account) {
    this.dialog.open(AccountUsersDialog, {
      width: '480px',
      data: account,
    });
  }

  addParticipationBookableDate() {
    this.dialog.open(AddParticipationDateDialog, {
      width: '360px',
    });
  }

  addMaintenanceBookableDate() {
    this.dialog.open(AddMaintenanceDateDialog, {
      width: '360px',
    });
  }

  addFixingBookableDate() {
    this.dialog.open(AddFixingDateDialog, {
      width: '360px',
    });
  }

  deleteBookableDate(bookableDate: BookableDate) {
    this.firebase.deleteDate(bookableDate.id);
  }

  getMaintenanceName(): string {
    return (new Date().getMonth() > 9 || new Date().getMonth() < 4) ? 'snöskottning' : 'gräsklippning';
  }

  getBookingType(): BookingType {
    return (new Date().getMonth() > 9 || new Date().getMonth() < 4) ? 'shoveling' : 'mowing';
  }
}
