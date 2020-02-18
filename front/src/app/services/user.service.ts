import { Injectable } from '@angular/core';
import {environment} from 'src/environments/environment';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseURL  = environment.apiURL + '/usuario'
  constructor(private http: HttpClient) { }

  getUser() {
    return this.http.get<User>(this.baseURL);
  }
}
