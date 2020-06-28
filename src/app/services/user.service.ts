import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private rootUrl = 'http://localhost:8087/myvideos';
  private token: string;
  private user: User;

  constructor(private http: HttpClient) {
    console.log('Hello LoginService');
  }
  
  login(user: string, password: string): Promise<void> {
    console.log(`[LoginService] login(${user},${password})`);
    return new Promise((resolve, reject) => {
      let url = this.rootUrl + `/sessions`;
      this.http.post(url, { email: user, password: password })
        .subscribe(
          (data: { userId: string, token: string }) => {
            this.token = data.token;
            localStorage.setItem('token', data.token);            
            let url = this.rootUrl + `/users/${data.userId}`;
            this.http.get(url, { params: { token: this.token } })
              .subscribe(
                (user: User) => {
                  this.user = user;
                  localStorage.setItem('user', JSON.stringify(user));
                  resolve();
                },
                (err) => reject(err)
              );
          },
          (err) => reject(err)
        );
    });
  }

  logout(): Promise<void> {
    console.log(`[LoginService] logout()`);
    return new Promise((resolve, reject) => {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.clear();
      resolve();
    });
  }

  addUser(user: User): Promise<User> {
    console.log('[LoginService] addUser(' + JSON.stringify(user) + ')');
    return new Promise((resolve, reject) => {
      let url = this.rootUrl + `/users`;
      this.http.post(url, user)
        .subscribe(
          (user: User) => { resolve(user); },
          (err) => { reject(err); }
        );
    });
  }

  listUsers(): Promise<User[]> {
    console.log('[LoginService] listUsers');
    return new Promise((resolve, reject) => {
      let url = this.rootUrl + `/users`;
      this.http.get(url, { params: { token: this.token } })
        .subscribe(
          (users: User[]) => { 
            //resolve(user); console.log('listusers') 
            console.log('resultado listado');
            console.log(users);
          },
          (err) => { reject(err); }
        );
    });
  }

  getUser(): User {
    console.log(`[LoginService] getUser(): ` + JSON.stringify(this.user));
    //return this.user;
    return JSON.parse(localStorage.getItem('user'));
  }
  getToken(): string {
    return localStorage.getItem('token');
    //return this.token;
  }
  updateUser(user: User): Promise<User> {
    console.log('[LoginService] updateUser(' + JSON.stringify(user) + ')');
    return new Promise((resolve, reject) => {
      let url = this.rootUrl + `/users/${this.user.id}`;
      this.http.put(url, user, { params: { token: this.token } })
        .subscribe(
          (user: User) => {
            this.user = user;
            resolve(user);
          },
          (err) => { reject(err); }
        );
    });
  }
}

