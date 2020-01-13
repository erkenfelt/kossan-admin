import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.less'],
})
export class ToolbarComponent {
  readonly user: User = null;

  constructor(private readonly router: Router, private readonly authService: AuthService) {
    this.user = authService.getCurrentUser();
  }

  get avatar() {
    return this.user.avatarUrl;
  }

  get initials() {
    const fullName = this.user.name.split(' ');
    if (fullName.length > 1) {
      const fnameInitial = fullName[0][0];
      const lnameInitial = fullName[fullName.length - 1][0];
      return fnameInitial + lnameInitial;
    }

    return fullName[0][0];
  }

  isAdmin() {
    return this.authService.getCurrentUser().admin;
  }

  home() {
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.logout();
  }

  admin() {
    this.router.navigate(['/admin']);
  }
}
