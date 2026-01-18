import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../core/account.service';
import { UserInfo } from '../../interfaces/UserInfo.interface';
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  constructor(private cdr: ChangeDetectionStrategy.OnPush) {}
  private account = inject(AccountService);
  protected credentials: UserInfo = {
    Username: '',
    Password: '',
  };
  protected loggedIn = signal(false);
  login() {
    this.account.login(this.credentials).subscribe({
      next: (result) => {
        console.log(`Login response object ${result}`);

        this.loggedIn.set(true);
      },
      // this.account.login(this.credentials),
      error: (error) => alert(error.message),
    });
    console.log(this.credentials);
  }
  logout() {
    this.loggedIn.set(false);
  }
}
