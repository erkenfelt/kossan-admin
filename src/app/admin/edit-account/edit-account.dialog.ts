import { Component, ChangeDetectorRef, OnInit, Inject } from '@angular/core';
import { FirebaseService } from '../../firebase/firebase.service';
import { ParticipationType } from '../../firebase/account.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Account } from '../../firebase/account.model';

@Component({
  templateUrl: './edit-account.dialog.html',
  styleUrls: ['./edit-account.dialog.less'],
})
export class EditAccountDialog implements OnInit {
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
    private readonly dialogRef: MatDialogRef<EditAccountDialog>,
    @Inject(MAT_DIALOG_DATA) private readonly data: Account,
  ) {}

  ngOnInit() {
    this.accountName = this.data.displayName;
    this.selectedParticipation = this.data.participation;
  }

  updateAccount() {
    if (this.accountName) {
      this.firebase.updateAccount(this.data.id, this.accountName, this.selectedParticipation);
      this.dialogRef.close();
    }
  }
}
