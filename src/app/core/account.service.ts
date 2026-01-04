import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserInfo } from './UserInfo.interface';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);

  baseUrl = 'https://localhost:5001/api/';
  login(creds: UserInfo) {
    return this.http.post(this.baseUrl + 'account/login', creds);
  }
}
