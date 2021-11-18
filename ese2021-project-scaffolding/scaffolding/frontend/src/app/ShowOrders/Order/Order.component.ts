import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-product',
  templateUrl: './Order.component.html',
  styleUrls: ['./Order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(
    public userService: UserService,
    public httpClient: HttpClient
  ) { }

  ngOnInit(): void {
  }

}
