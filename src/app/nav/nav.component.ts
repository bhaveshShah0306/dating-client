import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../core/account.service';
import { UserInfo } from '../core/UserInfo.interface';
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  private account = inject(AccountService);
  protected credentials!: UserInfo;
  login() {
    this.account.login(this.credentials).subscribe({
      next: (result) => this.account.login(this.credentials),
      error: (error) => alert(error.message),
    });
    console.log(this.credentials);
  }
}
