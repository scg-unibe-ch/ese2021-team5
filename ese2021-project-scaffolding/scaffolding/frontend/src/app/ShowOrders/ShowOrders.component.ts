import {Component, Input, OnInit, SimpleChange, SimpleChanges} from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {User} from "../models/user.model";
import {Order} from "../models/order.model";
import {Product} from "../models/product.model";
import {environment} from "../../environments/environment";
import {Post} from "../models/post.model";
import {UserService} from "../services/user.service";
import {OrdersService} from "../services/orders.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-ShowOrders',
  templateUrl: './ShowOrders.component.html',
  styleUrls: ['./ShowOrders.component.css']
})

export class ShowOrdersComponent implements OnInit {
  clickEventsubscription: Subscription;
  userStatusChangeEventSubscription: Subscription;
  loggedIn: boolean | undefined;
  //admin: boolean | undefined;

  @ Input() admin = false;

  user: User | undefined;
  allOrders: Order[] = [];
  userOrders: Order[] = [];
  allOrdersNewToOld: Order[] = [];
  userOrdersNewToOld: Order[] = [];
  username: string | undefined;


  constructor(
    public userService: UserService,
    public httpClient: HttpClient,
    public orderService: OrdersService,
  ) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);

    this.clickEventsubscription = this.orderService.getClickEvent().subscribe(() => {
      this.readOrders();
    })

    this.userStatusChangeEventSubscription = this.userService.getUserStatusChangeEvent().subscribe(() => {
      this.updateUserStatus();
    })
  }

  ngOnInit(): void {
  }


  /*
  check if the current user is an admin
   */
  checkAdmin():void{

    this.httpClient.get(environment.endpointURL + "admin").subscribe(() => {
        this.admin = true;},
      () => {
        this.admin = false;
      });
  }

  /*
  get all orders from the backend and store it in the array allOrders.
  then call readUserOrders() and orderArrays()
   */
  readOrders():void{
    this.allOrders = [];
    this.httpClient.get(environment.endpointURL + "order").subscribe((orders: any) => {
      orders.forEach((order: any) => {
        this.allOrders.push(new Order(order.user, order.buyerName, order.paymentMethod, order.deliveryAddress, order.purchase[0].title, order.statusId, order.orderId));
      })
      this.readUserOrders();
      this.orderArrays();
    })
  }

  /*
  *   make an array with all orders from the current user.
   */
  readUserOrders():void{
    this.userOrders = [];
    for (let i = 0; i < this.allOrders.length; i++){
      if (this.allOrders[i].buyerName == this.username){
        this.userOrders.push(this.allOrders[i]);
      }
    }
  }

  /*
  fill in the arrays all/user-OrdersNewToOld
   */
  orderArrays():void{
    this.allOrdersNewToOld = [];
    for (let i = this.allOrders.length - 1; i >= 0; i--){
      this.allOrdersNewToOld.push(this.allOrders[i]);
    }

    this.userOrdersNewToOld = [];
    for (let i = this.userOrders.length - 1; i >= 0; i--){
      this.userOrdersNewToOld.push(this.userOrders[i]);
    }
  }

  private updateUserStatus() {
    this.user = this.userService.getUser();
    this.username = this.user?.username;
    this.readOrders();
  }


}




