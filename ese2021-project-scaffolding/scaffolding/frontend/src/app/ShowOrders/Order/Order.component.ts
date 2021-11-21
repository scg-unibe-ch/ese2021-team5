import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from "../../services/user.service";
import {HttpClient} from "@angular/common/http";
import {Post} from "../../models/post.model";
import {Order} from "../../models/order.model";
import {User} from "../../models/user.model";
import {Product} from "../../models/product.model";

@Component({
  selector: 'app-order',
  templateUrl: './Order.component.html',
  styleUrls: ['./Order.component.css']
})
export class OrderComponent implements OnInit {

  user: User | undefined;

  constructor(
    public userService: UserService,
    public httpClient: HttpClient
  ) {
  }

  ngOnInit(): void {
  }

}
