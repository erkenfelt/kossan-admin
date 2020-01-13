import { Component, OnInit, Inject } from '@angular/core';
import { FirebaseService } from '../../firebase/firebase.service';
import { Observable } from 'rxjs';
import { User } from '../../auth/user.model';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-account-users',
  templateUrl: './account-users.dialog.html',
  styleUrls: ['./account-users.dialog.less'],
})
export class AccountUsersDialog implements OnInit {
  users: Observable<User[]>;
  name = '';
  email = '';
  error = false;

  constructor(
    private readonly firebase: FirebaseService,
    @Inject(MAT_DIALOG_DATA) private readonly account: Account,
  ) {}

  ngOnInit() {
    this.users = this.firebase.users(this.account.id);
  }

  addUser() {
    this.error = false;
    const userName = this.name.trim();
    const userEmail = this.email.trim().toLowerCase();
    if (this.validateEmail(userEmail)) {
      this.firebase.createUser(userName, userEmail, this.account.id);
      this.name = '';
      this.email = '';
    } else {
      this.error = true;
    }
  }

  updateRole(user: User) {
    this.firebase.updateUserRole(user.id, !user.admin);
  }

  deleteUser(user: User) {
    this.firebase.deleteUser(user.id);
  }

  private validateEmail(email): boolean {
    // tslint:disable-next-line:max-line-length
    const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegExp.test(String(email).toLowerCase());
  }
}
