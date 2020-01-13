import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.dialog.html',
  styleUrls: ['./new-password.dialog.less'],
})
export class NewPasswordDialog {
  email = '';

  constructor(
    private readonly afAuth: AngularFireAuth,
    private readonly dialogRef: MatDialogRef<NewPasswordDialog>,
  ) {}

  requestNewPassword() {
    this.afAuth.auth.sendPasswordResetEmail(this.email);
    this.dialogRef.close();
  }
}
