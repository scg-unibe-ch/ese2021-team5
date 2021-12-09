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
  loggedIn: boolean | undefined;
  //admin: boolean | undefined;

  @ Input() admin = false;

  user: User | undefined;
  allOrders: Order[] = [];
  userOrders: Order[] = [];
  username: string | undefined;


  constructor(
    public userService: UserService,
    public httpClient: HttpClient,
    public orderService: OrdersService,
  ) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
    this.user = userService.getUser();
    this.username = this.user?.username;

    this.clickEventsubscription = this.orderService.getClickEvent().subscribe(() => {
      this.readOrders();
    })
  }

  ngOnInit(): void {
    setTimeout(() =>{
      this.user = this.userService.getUser();
      this.username = this.user?.username;
      this.readOrders();
      }, 0);



    // this.checkAdmin();
    // this.allOrders.push(new Order(this.user,'example','testStreet',undefined,0,0));
    // this.allOrders.push(new Order(this.user,'example','testStreet',undefined,1,1));
    // this.allOrders.push(new Order(this.user,'example','testStreet',undefined,2,2));
  }



  checkAdmin():void{

    this.httpClient.get(environment.endpointURL + "admin").subscribe(() => {
        this.admin = true;},
      () => {
        this.admin = false;
      });
  }


  readOrders():void{
    this.allOrders = [];
    this.httpClient.get(environment.endpointURL + "order").subscribe((orders: any) => {
      orders.forEach((order: any) => {
        this.allOrders.push(new Order(order.user, order.buyerName, order.paymentMethod, order.deliveryAddress, order.product, order.statusId, order.orderId));
      })
      this.readUserOrders();
    })
  }

  /*
  *   funktioniert nicht. problem ist glaube ich der userService, also this.username ist undefiniert.
   */
  readUserOrders():void{
    this.userOrders = [];
    for (let i = 0; i < this.allOrders.length; i++){
      if (this.allOrders[i].buyerName == this.username){
        this.userOrders.push(this.allOrders[i]);
      }
    }
  }


  //nicht Pflicht.
  //sort orders by different criteria. (can be selected by user via checkbox or drop down)
  sortOrders():void{

  }
  //nicht Pflicht.
  //only show Orders with specific orderStatus (can be selected by user via drop down)
  showXStatusOnly():void{

  }


}




