import {Component, EventEmitter, Output} from '@angular/core';
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

  account: Account = new Account('', '','','','','','','');

  userToRegister: User = new User(0, '', '', this.account);

  userToLogin: User = new User(0, '', '', this.account);

  endpointMsgUser: string = '';
  endpointMsgAdmin: string = '';

  endpointMsgUsername: string = '';
  endpointMsgPassword: string = '';
  endpointMsgRegistration: string = '';
  endpointMsgLogin: string = '';

  @Output()
  userStatusChange = new EventEmitter();

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


  registerUser(): void {
    this.httpClient.post(environment.endpointURL + "user/register", {
      userName: this.userToRegister.username,
      password: this.userToRegister.password,
      firstName: this.userToRegister.account.firstname,
      lastName: this.userToRegister.account.lastname,
      email: this.userToRegister.account.email,
      street: this.userToRegister.account.address,
      city: this.userToRegister.account.city,
      plz: this.userToRegister.account.zip,
      phoneNumber: this.userToRegister.account.phone,
      birthday: this.userToRegister.account.birthday
    }).subscribe(() => {

      this.registrationState = 2;
      this.userToLogin.username = this.userToRegister.username;
      this.userToLogin.password = this.userToRegister.password;
      this.loginUser();
      this.userToRegister.username = this.userToRegister.password = this.userToRegister.account.firstname = this.userToRegister.account.lastname = '';
    },
      (err)=>{
        this.endpointMsgUsername = err.error.message.message;
      }
    );
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
      this.endpointMsgLogin = ``;

        this.userStatusChange.emit(); //triggers checkUserStatus() in app.component.ts
    },
      (err)=> {
      this.endpointMsgLogin = err.error.message.message;
      },
    );
  }

  logoutUser(): void {
    localStorage.removeItem('userName');
    localStorage.removeItem('userToken');

    this.userService.setLoggedIn(false);
    this.userService.setUser(undefined);

    this.userStatusChange.emit(); //triggers checkUserStatus() in app.component.ts
    this.userService.sendUserStatusChangeEvent();
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

    this.endpointMsgPassword = this.buildUserMessagePassword(containsUppercase, containsLowercase, containsSpecialChar, containsDigit, isLongEnough, requiredLength, password.length)

    return isLongEnough && containsUppercase && containsLowercase && containsDigit && containsSpecialChar;
  }

  /**
   * Returns true if:
   * all variables of Account have a length unequal to 0
   * the address contains a digit.
   * the email contains '@'
   * (not yet: the email isn't used already.
   *
   */
  checkProvidedAccountData(username: string, password: string, firstname: string, lastname: string, email: string, address: string, zip: string, city: string, phone: string, birthday: string):boolean{
    let dataIsOkay: boolean = false
    let addressContainsDigit: boolean = false;
    let dataNotZero: boolean = false;
    let emailContainsAt: boolean = false;

    if (username.length !== 0 && password.length !== 0 && firstname.length !== 0 && lastname.length !== 0 && email.length !== 0 && address.length !== 0 && city.length !== 0 && zip.length !== 0 && phone.length !== 0 && birthday.length !== 0){
      dataNotZero = true;
    }

    for(let i = 0; i < address.length; i++) {
      if (address.charCodeAt(i) >= 48 && address.charCodeAt(i) <= 57) {
        addressContainsDigit = true;
      }
    }

    for(let i = 0; i < email.length; i++) {
      if (email.charCodeAt(i) == 64 ) { //64 in unicode is @ symbol
        emailContainsAt = true;
      }
    }


    if(dataNotZero && addressContainsDigit && emailContainsAt ){ //&& emailNotUsed
      dataIsOkay = true;
    }

    this.endpointMsgRegistration = this.buildUserMessageRegistration(dataNotZero, addressContainsDigit, emailContainsAt); //, emailNotUsed

    return dataIsOkay;
  }

  /**
   * USED FOR PASSWORD
   * Uses concatenation to build a string giving information to the User.
   * Tells the user which parts of his password are invalid.
   * Uses HTML code [innerHTML] {@see user.component.html}
   */
  buildUserMessagePassword(containsUppercase: boolean, containsLowercase: boolean, containsSpecialChar: boolean, containsDigit: boolean, isLongEnough: boolean, requiredLength: number, passwordLength: number): string{
    let passwordTooShort: string = 'Your password is to short! It requires at least <b>' + requiredLength + '</b> characters.<br>';
    let noUpperCase: string = "Your password needs at least one <b>upper case</b> character. <br>";
    let noLowerCase: string = "Your password needs at least one <b>lower case</b> character. <br>";
    let noDigit: string = "Your password needs at least one <b>digit.</b> <br>";
    let noSpecialChar: string = "Your password needs at least one <b>special char.</b> <br>";
    this.endpointMsgPassword = '';

    if(!isLongEnough){
      this.endpointMsgPassword += passwordTooShort;
    }
    if (!containsUppercase) {
      this.endpointMsgPassword += noUpperCase;
    }
    if (!containsLowercase) {
      this.endpointMsgPassword += noLowerCase;
    }
    if (!containsSpecialChar){
      this.endpointMsgPassword += noSpecialChar;
    }
    if (!containsDigit){
      this.endpointMsgPassword += noDigit;
    }
    if (passwordLength === 0){
      this.endpointMsgPassword = '';
    }
    return this.endpointMsgPassword;
  }

  /**
   * USED FOR REGISTRATION
   * Uses concatenation to build a string giving information to the User.
   * Tells the user which parts of his registration are invalid.
   * Uses HTML code [innerHTML] {@see user.component.html}
   */
  buildUserMessageRegistration(dataNotZero: boolean, addressContainsDigit: boolean, emailContainsAt: boolean): string{
    let dataZero: string = 'Fill in all the information. <br>';
    let addressNoDigit: string = 'You missed the number from your address. <br>';
    let emailNoAt: string = 'Your E-Mail is not an E-Mail. <br>';
    this.endpointMsgRegistration = '';

    if(!dataNotZero){
      this.endpointMsgRegistration += dataZero;
    }
    if(!addressContainsDigit && dataNotZero){
      this.endpointMsgRegistration += addressNoDigit;
    }
    if(!emailContainsAt && dataNotZero){
      this.endpointMsgRegistration += emailNoAt;
    }

    return this.endpointMsgRegistration;
  }

  getUserName(): string{
    return this.userService.getUser()?.username || '(Unable to find username)';
  }

}
