import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../models/product.model";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @Input()
  product: Product = new Product(0, '', '', '', 0);

  loggedIn: boolean | undefined;

  constructor(
    public userService: UserService,
  ) {userService.loggedIn$.subscribe(res => this.loggedIn = res); }

  ngOnInit(): void {
  }

  orderButtonDisabled(): boolean {
    if (this.loggedIn == true){
      return false;
    } else return true;
  }
}
