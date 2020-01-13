import { Component, ChangeDetectorRef } from '@angular/core';
import { FirebaseService } from '../../firebase/firebase.service';
import { ParticipationType } from '../../firebase/account.model';
import { MatDialogRef } from '@angular/material';

@Component({
  templateUrl: './add-account.dialog.html',
  styleUrls: ['./add-account.dialog.less'],
})
export class AddAccountDialog {
  accountName = '';
  selectedParticipation: ParticipationType = 'full';

  participations = [
    { value: 'full', description: 'Har föräldramedverkan' },
    { value: 'semi-full', description: 'Har begränsad föräldramedverkan delar av terminen' },
    { value: 'limited', description: 'Har begränsad föräldramedverkan' },
    { value: 'no', description: 'Har ingen föräldramedverkan' },
  ];

  constructor(
    private readonly firebase: FirebaseService,
    private readonly dialogRef: MatDialogRef<AddAccountDialog>,
    private readonly cd: ChangeDetectorRef,
  ) {}

  createAccount() {
    if (this.accountName) {
      this.firebase.createAccount(this.accountName, this.selectedParticipation);
      this.dialogRef.close();
    }
  }
}
