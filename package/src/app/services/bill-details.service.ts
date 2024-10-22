import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { User } from '../interfaces/UsersInterfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BillDetailsService {

  private path = environment.api;
  private users : User[] = []

  constructor( private http: HttpClient) { }

  getUsersList() {
    const url = this.path +'/Users';
    return this.http.get<User[]>(url);
  }
}
