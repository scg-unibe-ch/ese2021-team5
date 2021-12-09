import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor() { }

  private subject = new Subject<any>();sendClickEvent() {
    this.subject.next();
  } // @ts-ignore
  getClickEvent(): Observable<any>{
    return this.subject.asObservable();
  }
}
