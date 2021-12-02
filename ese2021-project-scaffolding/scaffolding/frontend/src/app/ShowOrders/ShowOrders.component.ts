import {Component, Input, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {UserService} from "../services/user.service";
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user.model";
import {Order} from "../models/order.model";
import {Product} from "../models/product.model";
import {environment} from "../../environments/environment";
import {Post} from "../models/post.model";

@Component({
  selector: 'app-ShowOrders',
  templateUrl: './ShowOrders.component.html',
  styleUrls: ['./ShowOrders.component.css']
})
export class ShowOrdersComponent implements OnInit {
  loggedIn: boolean | undefined;
  //admin: boolean | undefined;

  @ Input() admin = false;

  user: User | undefined;
  allOrders: Order[] = [];


  constructor(
    public userService: UserService,
    public httpClient: HttpClient
  ) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
    this.user = userService.getUser();
  }

  ngOnInit(): void {
    //this.checkAdmin();
    this.allOrders.push(new Order(this.user,'example','testStreet',undefined,0,0));
    this.allOrders.push(new Order(this.user,'example','testStreet',undefined,1,1));
    this.allOrders.push(new Order(this.user,'example','testStreet',undefined,2,2));
  }

  checkAdmin():void{

    this.httpClient.get(environment.endpointURL + "admin").subscribe(() => {
        this.admin = true;},
      () => {
        this.admin = false;
      });
  }

  //will be called by the method buyProduct in shop.component. //maybe we could also just call readOrders() and then get the new order from the backend?
  newOrder(product: Product, customer: User, paymentMethod: string, deliveryAddress: string):void{
  //create order in backend with the given input and StatusIndex = 0
  }

  readOrders():void{
    this.httpClient.get(environment.endpointURL + "order").subscribe((orders: any) => {
      orders.forEach((order: any) => {
        this.allOrders.push(new Order(order.user, order.paymentMethod, order.deliveryAddress, order.product, order.statusIndex, order.orderId));
      })
    })
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




