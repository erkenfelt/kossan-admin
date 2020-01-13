import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly router: Router, private readonly authService: AuthService) {}

  canActivate(): boolean {
    const user = this.authService.getCurrentUser();
    if (user && user.admin) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
