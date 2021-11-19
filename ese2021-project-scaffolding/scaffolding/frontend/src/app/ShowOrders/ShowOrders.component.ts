import {Component, Input, OnInit} from '@angular/core';
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
  }

  checkAdmin():void{

    this.httpClient.get(environment.endpointURL + "admin").subscribe(() => {
        this.admin = true;},
      () => {
        this.admin = false;
      });
  }

  //will be called by the method buyProduct in shop.component.
  newOrder(product: Product, username: string, paymentMethod: string, deliveryAddress: string):void{
  //create order in backend with the given input and StatusIndex = 0
  }

  readOrders():void{
    this.httpClient.get(environment.endpointURL + "order").subscribe((orders: any) => {
      orders.forEach((order: any) => {
        this.allOrders.push(new Order(order.user, order.paymentMethod, order.deliveryAddress, order.product, order.statusIndex));
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
  }
}




