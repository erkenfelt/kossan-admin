import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  loading = true;

  constructor(private readonly auth: AuthService) {
    auth.user.pipe(take(1)).subscribe(() => {
      this.loading = false;
    });
  }
}
