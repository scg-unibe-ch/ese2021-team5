import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Product} from "../../models/product.model";
import {UserService} from "../../services/user.service";
import {HttpClient} from "@angular/common/http";
import {User} from "../../models/user.model";
import {environment} from "../../../environments/environment";
import {OrdersService} from "../../services/orders.service";


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
  paymentWithTwint: boolean = false;
  sendOrderDisable = true;

  deliveryAddress: string | undefined = '';
  detailsButtonText: string = "BUY NOW";
  paymentMethod: string = "";
  categoryString: string = "";

  customer: User | undefined;

  orderStatus: number = 0;

  constructor(
    public userService: UserService,
    public httpClient: HttpClient,
    public orderService: OrdersService,
  ) {
  }

  /**
   * Returns true if the user is logged in.
   */
  loggedIn(): boolean {
    return this.userService.getLoggedIn() || false;
  }

  /**
   * Calls initializeDeliveryAddress() to initialize the delivery address to match a logged in user.
   */
  ngOnInit(): void {
    this.initializeDeliveryAddress();
  }

  /**
   * Initializes the delivery address as a nice looking string.
   */
  initializeDeliveryAddress(): void {
    this.deliveryAddress = this.customer?.account.firstname + " " + this.customer?.account.lastname + "\n"
      + this.customer?.account.address + "\n"
      + this.customer?.account.zip + " " + this.customer?.account.city;
  }

  /**
   * Emits an event to delete a product.
   * Products are deleted by shop.component.ts#deleteProduct().
   */
  deleteProduct(): void {
    this.delete.emit(this.product);
  }

  /**
   * Shows the detailed options for ordering a product.
   * Also changes the text on the buttons to match the new state.
   */
  showOrderOptions(): boolean {
    this.showPaymentAndDeliveryOptions = !this.showPaymentAndDeliveryOptions;
    this.product.paymentWithInvoice = true;

    this.paymentMethod = 'invoice';
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

  /**
   * Shows the detailed options for ordering a product.
   * Also changes the text on the buttons to match the new state.
   */
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

  /**
   * Is called when selecting a payment method in product.component.html via a checkbox.
   * Sets the payment method and un-checks the other checkbox.
   * Initially payment method is set to 'invoice'.
   * @param paymentMethod, the payment method selected by the user.
   */
  chosePaymentMethod(paymentMethod: string): void {
    switch (paymentMethod) {
      case 'invoice':
        this.paymentWithTwint = false;
        break;
      case 'twint':
        this.product.paymentWithInvoice = false;
        break;
    }
    if(this.paymentWithTwint){
      this.paymentMethod = "Twint";
    }
    if(this.product.paymentWithInvoice){
      this.paymentMethod = "Invoice";
    }
  }

  /**
   * Sends an order to the backend and resets the window for ordering the product.
   */
  sendOrder() {
    this.httpClient.post(environment.endpointURL + 'order', {
      purchaserId: this.customer?.userId,
      statusId: 0,
      purchase: [ this.product.productId ],
      paymentMethod: this.paymentMethod,
      userId: this.customer?.userId,
      deliveryAddress: this.deliveryAddress,
      buyerName: this.customer?.username,
    }).subscribe( () => {
      this.orderStatus = 0;
      this.showPaymentAndDeliveryOptions = false;
      this.detailsButtonText = "BUY NOW"
      this.resetPaymentOption();
      this.initializeDeliveryAddress();

      this.orderService.sendClickEvent();
    })
  }

  resetPaymentOption(): void {
    this.paymentWithTwint = false;
    this.product.paymentWithInvoice = true;
  }

  /**
   * Returns true (which is used by product.component.html to disable the button for sending an order) if a user has not entered a delivery address or chosen a payment method.
   */
  sendOrderDisabled(): boolean {
    if (!this.product.paymentWithInvoice && !this.paymentWithTwint){
      return true;
    } else if (this.deliveryAddress == ''){
      return true;
    } else return false;
  }

  /**
   * Parses a number category to a string.
   */
  parseCategory(): string{
    this.categoryString = "";
    switch(this.product.categoryId){
      case 1:{
        this.categoryString = "Clothes";
        break;
      }
      case 2:{
        this.categoryString = "Poster";
        break;
      }
      case 3:{
        this.categoryString = "Figure";
        break;
      }
      case 4:{
        this.categoryString = "Other";
        break;
      }

    }
    return this.categoryString;
  }
}
