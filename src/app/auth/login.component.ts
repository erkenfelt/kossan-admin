import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NewPasswordDialog } from './new-password/new-password.dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent {
  hide = true;
  email = '';
  password = '';
  authenticating = false;
  failed = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
  ) {}

  async authenticate() {
    if (this.authenticating) {
      return;
    }
    if (this.email === '' || this.password === '') {
      this.failed = true;
      return;
    }

    this.failed = false;
    this.authenticating = true;

    try {
      const signedIn = await this.authService.signInAsync(this.email, this.password);
      if (signedIn) {
        this.router.navigate(['/']);
      }
    } catch {
      this.failed = true;
    }
    this.authenticating = false;
  }

  async signInWithGoogle() {
    this.authenticating = true;
    try {
      await this.authService.signInWithGoogleAsync();
      this.router.navigate(['/']);
    } catch {
      this.failed = true;
    }
    this.authenticating = false;
  }

  async signInWithFacebook() {
    this.authenticating = true;
    try {
      await this.authService.signInWithFacebookAsync();
      this.router.navigate(['/']);
    } catch {
      this.failed = true;
    }
    this.authenticating = false;
  }

  openResetPassword() {
    this.dialog.open(NewPasswordDialog, {
      width: '360px',
    });
  }
}
