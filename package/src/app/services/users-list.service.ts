import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { User } from '../interfaces/UsersInterfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersListService {
  private path = environment.api;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  getUsersList() {
    const url = this.path + '/Users';
    return this.http.get<User[]>(url);
  }

  setUser(userObject: User) {
    const url = this.path + '/Users';

    return this.http.post(url, JSON.stringify(userObject), { headers: this.headers })
  }

  updateUser(userObject: User, userId: number) {
    const url = this.path + '/Users/' + userId;
    return this.http.put(url, JSON.stringify(userObject), { headers: this.headers });
  }

  reloadUsersList() {
    this.getUsersList().subscribe((usersList) => {
      console.log('Lista actualizada de usuarios:', usersList);
      return usersList;
    });
  }

  deleteUser(userId: number) {
    const url = this.path + '/Users/' + userId;
    return this.http.delete(url, { headers: this.headers });
  }
}
