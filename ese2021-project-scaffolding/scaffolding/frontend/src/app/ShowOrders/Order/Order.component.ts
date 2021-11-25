import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from "../../services/user.service";
import {HttpClient} from "@angular/common/http";
import {Post} from "../../models/post.model";
import {Order} from "../../models/order.model";
import {User} from "../../models/user.model";
import {Product} from "../../models/product.model";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-order',
  templateUrl: './Order.component.html',
  styleUrls: ['./Order.component.css']
})
export class OrderComponent implements OnInit {
  @Input()
  Order: Order = new Order(undefined, '', '', undefined, 0);

  user: User | undefined;
  loggedIn: boolean | undefined;
  admin: boolean = false;
  status: string = "";

  constructor(
    public userService: UserService,
    public httpClient: HttpClient
  ) {
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
  }

  ngOnInit(): void {
    this.checkAdmin();
    this.setStatus();
  }

  checkAdmin():void{

    this.httpClient.get(environment.endpointURL + "admin").subscribe(() => {
        this.admin = true;},
      () => {
        this.admin = false;
      });
  }

  //Translates the statusIndex to the according status.
  setStatus(): void{
    this.status = 'current status: '
    if(this.Order.statusIndex == 0){
      this.status += 'Pending'
    }
    else if(this.Order.statusIndex == 1){
      this.status += 'Shipped'
    }
    else if(this.Order.statusIndex == 2){
      this.status += 'Cancelled'
    }
  }

  //admin can change OrderStatus from Pending to Shipped (statusIndex 0 -> 1)
  //user can change OrderStatus from Pending to Cancelled (statusIndex 0 -> 2)
  UpdateOrderStatus(order: Order):void{
    if(order.statusIndex == 0){
      if(this.admin){
        order.statusIndex = 1;
      }
      else{
        order.statusIndex = 2;
      }
    }
    this.setStatus();
  }

}
