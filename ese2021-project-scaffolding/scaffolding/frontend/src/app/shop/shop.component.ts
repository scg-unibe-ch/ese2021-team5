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

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
  ) {
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
  }

  ngOnInit(): void {
    this.readProducts();

    //only for testing ui testing (does not support full product functionality)
    /*
    this.productsArray.push(new Product(1, "A Thing", "You totally need this thing! <br> Note: This text doesn't look good right now ):", "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c12c5e21-79bd-4999-82a7-8f5adcfba4fc/defqisu-310c7de5-8094-458c-bd75-481a01026b3e.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2MxMmM1ZTIxLTc5YmQtNDk5OS04MmE3LThmNWFkY2ZiYTRmY1wvZGVmcWlzdS0zMTBjN2RlNS04MDk0LTQ1OGMtYmQ3NS00ODFhMDEwMjZiM2UucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.2WYNGHCgLI17G_ttJdsaKLmoAm0x-Q1Ump-mVAKaIYw", 12, 0))
    this.productsArray.push(new Product(2, "A picture of a man holding dollar bills", "I haven't seen <b>The Simpons</b>. <br> Still the picture looks nice. <br> Especially the background.", "https://banner2.cleanpng.com/20180920/aet/kisspng-mr-burns-stereotype-character-drawing-image-cosas-para-photoscape-imgenes-para-photoscape-d-5ba4147aba9c71.8569712015374798027644.jpg", 1, 0))
    this.productsArray.push(new Product(1, "Product Three", "This Product doesn't have a picture! <br> And this description doesn't help a lot.", this.imageUri, 100, 0))
    this.splitProductsLeftRight(); */
  }

  /**
   * Called upon initialization. Gets all products from the backend and adds them to the productsArray.
   */
  readProducts(): void {
    this.productsArray = [];
    this.httpClient.get(environment.endpointURL + "product").subscribe((products: any) => {
      products.forEach((product: any) => {
        this.productsArray.push(new Product(product.categoryId, product.title, product.description, product.imageUri, product.price, product.productId));
      })
      this.splitProductsLeftRight();
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

    for (let i = 0; i < this.productsArray.length; i++){
      if (i % 2 == 0){
        this.productsArrayLeftSide.push(this.productsArray[i]);
      } else {
        this.productsArrayRightSide.push(this.productsArray[i]);
      }
    }
  }
}
