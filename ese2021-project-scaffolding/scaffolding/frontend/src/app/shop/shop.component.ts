import {Component, Input, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {Product} from "../models/product.model";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../services/user.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  @ Input() admin = false;

  ngOnChanges(changes: SimpleChanges){
    this.admin = changes.admin.currentValue;
  }

  productsArray: Product[] = [];

  //values for creating new products
  categoryId: number = 0;
  title: string = '';
  description: string = '';
  imageUri: string = '';
  price: number = 0;

  showNewProductForm: boolean = false;
  disableNewProductPostButton: boolean = true;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
  ) {

  }

  ngOnInit(): void {
    //this.readProducts(); Not implemented --> waiting for backend

    //only for testing --> will be removed once admins can create products
    this.productsArray.push(new Product(this.categoryId, "Product One", this.description, this.imageUri, this.price))
    this.productsArray.push(new Product(this.categoryId, "Product Two", this.description, this.imageUri, this.price))
  }

  /**
   * Called upon initialization. Gets all products from the backend and adds them to the productsArray.
   */
  readProducts(): void {
    this.httpClient.get(environment.endpointURL + "product/view/all").subscribe((products: any) => {
      products.forEach((product: any) => {
        this.productsArray.push(new Product(product.categoryId, product.title, product.description, product.imageUri, product.price))
      })
    })
  }

  /**
   * Only Admins can create new products.
   */
  createProduct(): void {
    this.httpClient.post(environment.endpointURL + "product/add", {
      categoryId: this.categoryId,
      title: this.title,
      description: this.description,
      imageUri: this.imageUri,
      price: this.price,
    }).subscribe( (product: any) => {
      this.productsArray.push(new Product(product.categoryId, product.title, product.description, product.imageUri, product.price))
    }
    )
  }

  /**
   * Switches between displaying and hiding the form for creating new products.
   * Only admins can create new products.
   */
  newProduct(): void {
    this.showNewProductForm = !this.showNewProductForm;
  }

  resetNewPostValues(): void {
    this.categoryId = 0;
    this.title = '';
    this.description = '';
    this.imageUri = '';
    this.price = 0;
  }

  discardChanges() {
    this.resetNewPostValues();
    this.newProduct(); // resets the new product form to be invisible
  }

  /**
   * Checks whether the user (an admin) has entered all required information.
   * Category ID and Price need to bee numbers.
   */
  checkNewProductInformation(): boolean {
    if (this.categoryId != 0 && this.title != "" && this.description != "" && this.imageUri != '' && this.price != 0){
      if (/^\d+$/.test(String(this.categoryId)) && /^\d+$/.test(String(this.price))) {
        this.disableNewProductPostButton = false;
      }
    } else {
      this.disableNewProductPostButton = true;
    }
    return this.disableNewProductPostButton;
  }
}
