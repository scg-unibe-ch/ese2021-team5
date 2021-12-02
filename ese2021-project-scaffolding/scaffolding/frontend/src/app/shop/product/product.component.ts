import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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

  @Output()
  delete = new EventEmitter<Product>();

  @Input()
  product: Product = new Product(0, '', '', '', 0, 0);
  @Input()
  admin: boolean = false;

  showPaymentAndDeliveryOptions: boolean = false;
  paymentWithInvoice: boolean = false;
  paymentWithTwint: boolean = false;
  deliveryAddress: string | undefined = '';
  customer: User | undefined;
  orderStatus: number = 0;
  detailsButtonText: string = "BUY NOW";
  sendOrderDisable = true;


  constructor(
    public userService: UserService,
  ) {
  }

  loggedIn(): boolean {
    return this.userService.getLoggedIn() || false;
  }

  ngOnChange(): void{

  }

  ngOnInit(): void {
    this.initializeDeliveryAddress();
  }

  initializeDeliveryAddress(): void {
    this.deliveryAddress = this.customer?.account.firstname + " " + this.customer?.account.lastname + "\n"
      + this.customer?.account.address + "\n"
      + this.customer?.account.zip + " " + this.customer?.account.city;
  }

  deleteProduct(): void {
    this.delete.emit(this.product);
  }

  //Needs refactoring --> ugly mess
  showOrderOptions(): boolean {
    this.showPaymentAndDeliveryOptions = !this.showPaymentAndDeliveryOptions;
    if (this.orderStatus == 1){
      this.orderStatus = 0;
      this.detailsButtonText = 'BUY NOW';
    } else {
      this.orderStatus = 1;
      this.detailsButtonText = 'Discard Changes!';
      this.customer = this.userService.getUser();
      this.initializeDeliveryAddress();
      this.resetPaymentOption();

    }

    return this.showPaymentAndDeliveryOptions;
  }


  //Needs refactoring --> ugly mess
  showOptionsAndLoggedIn() {
    if(this.loggedIn() && this.showPaymentAndDeliveryOptions){
      return true;
    } else if (!this.loggedIn()){
      this.showPaymentAndDeliveryOptions = false;
      this.orderStatus = 0;
      this.detailsButtonText = 'BUY NOW';
      return false;
    } else return false;
  }

  chosePaymentMethod(paymentMethod: string): void {
    switch (paymentMethod) {
      case 'invoice':
        this.paymentWithTwint = false;
        break;
      case 'twint':
        this.paymentWithInvoice = false;
        break;
    }
  }

  sendOrder() { //unfinished implementation
    console.log("not implemented - waiting for backend");
    this.orderStatus = 0;
    this.showPaymentAndDeliveryOptions = false;
    this.detailsButtonText = "BUY NOW"
    this.resetPaymentOption();
    this.initializeDeliveryAddress();
  }

  resetPaymentOption(): void {
    this.paymentWithTwint = false;
    this.paymentWithInvoice = false;
  }

  sendOrderDisabled(): boolean {
    if (!this.paymentWithInvoice && !this.paymentWithTwint){
      return true;
    } else if (this.deliveryAddress == ''){
      return true;
    } else return false;
  }


}
