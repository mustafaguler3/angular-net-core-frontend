import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject, map, of } from 'rxjs';
import { Address, User } from '../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = 'http://localhost:5182/api/';

  private userSource = new ReplaySubject<User | null>(1);
  userSource$ = this.userSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  loadCurrentUser(token: string){

    if(token === null){
      this.userSource.next(null);
      return of(null)
    }

    let headers = new HttpHeaders();
    headers = headers.set("Authorization",`Bearer ${token}`)

    return this.http.get<User>(this.baseUrl + "account",{headers}).pipe(
      map(user => {
        if(user){
          localStorage.setItem("token",user.token);
        this.userSource.next(user)
        return user
        }else {
          return null
        }
      })
    )
  }

  login(value: any){
    return this.http.post<User>(this.baseUrl +"account/login",value)
    .pipe(map(user => {
      localStorage.setItem("token",user.token);
      this.userSource.next(user)
    }))
  }

  register(value: any){
    return this.http.post<User>(this.baseUrl +"account/register",value)
    .pipe(map(user => {
      localStorage.setItem("token",user.token);
      this.userSource.next(user)
    }))
  }

  logout(){
    localStorage.removeItem("token");
    this.userSource.next(null);
    this.router.navigateByUrl("/")
  }

  checkEmailExists(email: string){
    return this.http.get<boolean>(this.baseUrl+"account/emailexists?email="+email)
  }

  getUserAddress(){
    return this.http.get<Address>(this.baseUrl + "account/address")
  }

  updateUserAddress(address: Address){
    return this.http.put(this.baseUrl+"account/address",address);
  }
}
