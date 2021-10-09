import { Component } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import {Account} from "../models/account.model";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  loggedIn: boolean | undefined;

  registrationState: number = 0;

  user: User | undefined;

  account: Account = new Account('', '');

  userToRegister: User = new User(0, '', '', this.account);

  userToLogin: User = new User(0, '', '', this.account);

  endpointMsgUser: string = '';
  endpointMsgAdmin: string = '';

  endpointMsgRegistration: string = '';

  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
    userService.user$.subscribe(res => this.user = res);

    // Current value
    this.loggedIn = userService.getLoggedIn();
    this.user = userService.getUser();  //might be undefined

  }

  updateRegistrationState(): void{
    this.registrationState = 1;
  }

  registerUser(): void {
    this.httpClient.post(environment.endpointURL + "user/register", {
      userName: this.userToRegister.username,
      password: this.userToRegister.password
    }).subscribe(() => {
      this.registrationState = 2;
      this.userToLogin.username = this.userToRegister.username;
      this.userToLogin.password = this.userToRegister.password;
      this.loginUser();
      this.userToRegister.username = this.userToRegister.password = this.userToRegister.account.firstname = this.userToRegister.account.lastname = '';
    });
  }

  loginUser(): void {
    this.httpClient.post(environment.endpointURL + "user/login", {
      userName: this.userToLogin.username,
      password: this.userToLogin.password
    }).subscribe((res: any) => {
      this.userToLogin.username = this.userToLogin.password = '';

      localStorage.setItem('userName', res.user.userName);
      localStorage.setItem('userToken', res.token);

      this.userService.setLoggedIn(true);
      this.userService.setUser(new User(res.user.userId, res.user.userName, res.user.password, this.account));
    });
  }

  logoutUser(): void {
    localStorage.removeItem('userName');
    localStorage.removeItem('userToken');

    this.userService.setLoggedIn(false);
    this.userService.setUser(undefined);
  }

  accessUserEndpoint(): void {
    this.httpClient.get(environment.endpointURL + "secured").subscribe(() => {
      this.endpointMsgUser = "Access granted";
    }, () => {
      this.endpointMsgUser = "Unauthorized";
    });
  }

  accessAdminEndpoint(): void {
    this.httpClient.get(environment.endpointURL + "admin").subscribe(() => {
      this.endpointMsgAdmin = "Access granted";
    }, () => {
      this.endpointMsgAdmin = "Unauthorized";
    });
  }

  /**
   * Returns true if a password: string holds a set of defined properties.
   * implemented properties:
   * -required length
   * -contains upper and lowercase characters
   * -contains special character
   * -contains digit
   */
  checkPasswordProperties(password: string): boolean{
    let isLongEnough: boolean = false;
    let containsUppercase: boolean = false;
    let containsLowercase: boolean = false;
    let containsDigit: boolean = false;
    let containsSpecialChar: boolean = false;
    let requiredLength = 8;

    if (password.length >= requiredLength){
      isLongEnough = true;
    }

    for(let i = 0; i < password.length; i++){
      if(password.charCodeAt(i) >= 65 && password.charCodeAt(i) <= 90){ //unicode --> doesn't work for: Ö, Ä, etc.
        containsUppercase = true;
      }
      if(password.charCodeAt(i) >= 97 && password.charCodeAt(i) <= 122){
        containsLowercase = true;
      }
      if (password.charCodeAt(i) >= 48 && password.charCodeAt(i) <= 57){
        containsDigit = true;
      }
      if ((password.charCodeAt(i) >= 32 && password.charCodeAt(i) <= 47) || //special chars are hard to define in unicode;
        (password.charCodeAt(i) >= 58 && password.charCodeAt(i) <= 64) ||
        (password.charCodeAt(i) >= 91 && password.charCodeAt(i) <= 96) ||
        (password.charCodeAt(i) >= 123 && password.charCodeAt(i) <= 126)){
        containsSpecialChar = true;
      }
    }

    this.endpointMsgRegistration = this.buildUserMessage(containsUppercase, containsLowercase, containsSpecialChar, containsDigit, isLongEnough, requiredLength, password.length)

    return isLongEnough && containsUppercase && containsLowercase && containsDigit && containsSpecialChar;
  }

  checkProvidedAccountData(firstname: string, lastname: string):boolean{
    let dataIsOkay: boolean = false;

    if (firstname.length !== 0 && lastname.length !== 0){
      dataIsOkay = true;
    }

    return dataIsOkay;
  }

  /**
   * Uses concatenation to build a string giving information to the User.
   * Tells the user which parts of his password are invalid.
   * Uses HTML code [innerHTML] {@see user.component.html}
   */
  buildUserMessage(containsUppercase: boolean, containsLowercase: boolean, containsSpecialChar: boolean, containsDigit: boolean, isLongEnough: boolean, requiredLength: number, passwordLength: number): string{
    let passwordTooShort: string = 'Your password is to short! It requires at least <b>' + requiredLength + '</b> characters.<br>';
    let noUpperCase: string = "Your password needs at least one <b>upper case</b> character. <br>";
    let noLowerCase: string = "Your password needs at least one <b>lower case</b> character. <br>";
    let noDigit: string = "Your password needs at least one <b>digit.</b> <br>";
    let noSpecialChar: string = "Your password needs at least one <b>special char.</b> <br>";
    this.endpointMsgRegistration = '';

    if(!isLongEnough){
      this.endpointMsgRegistration += passwordTooShort;
    }
    if (!containsUppercase) {
      this.endpointMsgRegistration += noUpperCase;
    }
    if (!containsLowercase) {
      this.endpointMsgRegistration += noLowerCase;
    }
    if (!containsSpecialChar){
      this.endpointMsgRegistration += noSpecialChar;
    }
    if (!containsDigit){
      this.endpointMsgRegistration += noDigit;
    }
    if (passwordLength === 0){
      this.endpointMsgRegistration = '';
    }
    return this.endpointMsgRegistration;
  }

  /**
   * Strange getter --> For some reason i'm unable to access localStorage from within
   * the HTML directly?
   */
  getUserName(): string{

    return <string>localStorage.getItem('userName');
  }

}
