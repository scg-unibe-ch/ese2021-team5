import {Component, Input, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {Product} from "../models/product.model";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../services/user.service";
import {environment} from "../../environments/environment";
import {User} from "../models/user.model";

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

  selectedProductsArray: Product[] = [];
  productsArray: Product[] = [];
  productsArrayLeftSide: Product [] = [];
  productsArrayRightSide: Product [] =[];

  //values for creating new products
  categoryId: number = 0;
  title: string = '';
  description: string = '';
  imageUri: string = '';
  price: number = 0;
  loggedIn: boolean = false;

  showNewProductForm: boolean = false;
  disableNewProductPostButton: boolean = true;
  selectedCategory: string = "1";

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
  ) {
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
  }

  ngOnInit(): void {
    this.readProducts();
    this.selectCategory()  }

  /**
   * Called upon initialization. Gets all products from the backend and adds them to the productsArray.
   */
  readProducts(): void {
    this.productsArray = [];
    this.httpClient.get(environment.endpointURL + "product").subscribe((products: any) => {
      products.forEach((product: any) => {
        if(product.active) {
          this.productsArray.push(new Product(product.categoryId, product.title, product.description, product.imageUri, product.price, product.productId));
        }
      })
      this.selectCategory();
    })
  }

  /**
   * Only Admins can create new products.
   */
  createProduct(): void {

    this.httpClient.post(environment.endpointURL + "product", {
      categoryId: this.categoryId,
      title: this.title,
      description: this.description,
      imageUri: this.imageUri,
      price: this.price,
    }).subscribe( (product: any) => {
      this.productsArray.push(new Product(product.categoryId, product.title, product.description, product.imageUri, product.price, product.productId));
      this.resetNewProductValues();
      this.readProducts();
      this.discardChanges();
     }
    )
  }

  /**
   * Only Admins can delete products.
   */
  deleteProduct(product: Product): void {
    this.httpClient.delete(environment.endpointURL + "product/" + product.productId).subscribe( () => {
      this.readProducts();
    })
  }

  /**
   * Switches between displaying and hiding the form for creating new products.
   * Only admins can create new products.
   */
  newProduct(): void {
    this.showNewProductForm = !this.showNewProductForm;
  }

  resetNewProductValues(): void {
    this.categoryId = 0;
    this.title = '';
    this.description = '';
    this.imageUri = '';
    this.price = 0;
  }

  discardChanges() {
    this.resetNewProductValues();
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

  /**
   * Splits the array holding all products into two arrays, so that the products can be displayed in two columns.
   */
  splitProductsLeftRight(): void {
    this.productsArrayLeftSide = [];
    this.productsArrayRightSide = [];

    for (let i = 0; i < this.selectedProductsArray.length; i++){
      if (i % 2 == 0){
        this.productsArrayLeftSide.push(this.selectedProductsArray[i]);
      } else {
        this.productsArrayRightSide.push(this.selectedProductsArray[i]);
      }
    }
  }

  selectCategory() {
    this.selectedProductsArray = [];
    for (let i = 0; i < this.productsArray.length; i++){
      if (this.productsArray[i].categoryId.toString() == this.selectedCategory){
        this.selectedProductsArray.push(this.productsArray[i]);
      }
    }
    this.splitProductsLeftRight();
  }
}
