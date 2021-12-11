import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  private loggedIn: boolean | undefined;

  private user: User | undefined;

  private subject = new Subject<any>();


  /*******************************************************************************************************************
   * OBSERVABLE SOURCES & STREAMS
   ******************************************************************************************************************/

  // Observable Sources
  private loggedInSource = new Subject<boolean>();
  private userSource = new Subject<User>();

  // Observable Streams
  loggedIn$ = this.loggedInSource.asObservable();
  user$ = this.userSource.asObservable();


  /*******************************************************************************************************************
   * GETTERS
   ******************************************************************************************************************/

  getLoggedIn(): boolean | undefined {
    return this.loggedIn;
  }

  getUser(): User | undefined {
    return this.user;
  }

  getUserStatusChangeEvent(){
    return this.subject.asObservable();
  }


  /*******************************************************************************************************************
   * SETTERS
   ******************************************************************************************************************/

  setLoggedIn(loggedIn: boolean | undefined): void {
    this.loggedInSource.next(loggedIn);
  }

  setUser(user: User | undefined): void {
    this.userSource.next(user);
  }

  sendUserStatusChangeEvent(){
    this.subject.next();
  }

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor() {
    // Observer
    this.loggedIn$.subscribe(res => this.loggedIn = res);
    this.user$.subscribe(res => this.user = res);


    // Default values
    this.setLoggedIn(false);
  }
}
