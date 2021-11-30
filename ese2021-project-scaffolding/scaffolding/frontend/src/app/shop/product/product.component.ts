import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../models/product.model";
import {UserService} from "../../services/user.service";
import {HttpClient} from "@angular/common/http";
import {User} from "../../models/user.model";
import {Account} from "../../models/account.model";


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {

  @Input()
  product: Product = new Product(0, '', '', '', 0);

  showPaymentAndDeliveryOptions: boolean = false;
  paymentWithInvoice: boolean = false;
  paymentWithTwint: boolean = false;
  deliveryAddress: string | undefined = '';
  customer: User | undefined;
  orderState: number = 0;


  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
  ) {
    this.customer = this.userService.getUser(); //not working
  }

  loggedIn(): boolean {
    return this.userService.getLoggedIn() || false;
  }

  ngOnInit(): void {
    this.initializeDeliveryAddress();
  }

  initializeDeliveryAddress(): void {
    this.deliveryAddress = this.customer?.account.address;
  }

  orderButtonDisabled(): boolean {
    if (this.loggedIn()){
      this.orderState = 1;
      return false;
    } else return true;
  }

  showOrderOptions(): boolean {
    this.showPaymentAndDeliveryOptions = !this.showPaymentAndDeliveryOptions;
    return this.showPaymentAndDeliveryOptions;
  }

  chosePaymentMethod(paymentMethod: string): void {
    switch (paymentMethod) {
      case 'invoice': this.paymentWithTwint = false;
                      break;
      case 'twint': this.paymentWithInvoice = false;
                    break;

    }
  }


}
