// @ts-ignore

import { TestBed } from '@angular/core/testing';

import { ShopComponent } from './shop.component';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {FeedWallComponent} from "../feed-wall/feed-wall.component";
import {environment} from "../../environments/environment";
import {Product} from "../models/product.model";

describe('ShopComponent', () => {
  let component: ShopComponent;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopComponent ],
      imports: [HttpClientTestingModule],
      providers: [ShopComponent]
    })
    .compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    component = TestBed.inject(ShopComponent);
  });

  afterEach( () => {
    httpMock.verify(); //Verifies that no requests are outstanding.
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read two products and add them to productsArray', (done: DoneFn) => {

    const mockResponse = [{
      categoryId: 1,
      title: 'mockTitle',
      description: 'mockDescription',
      imageUri: 'mockUri',
      price: 1,
      productId: 1,
      active: true,
    },
      {
        categoryId: 2,
        title: 'mockTitleTwo',
        description: 'mockDescriptionTwo',
        imageUri: 'mockUriTwo',
        price: 2,
        productId: 2,
        active: true,
      }
    ]

    component.readProducts();

    const mockRequest = httpMock.expectOne(
      environment.endpointURL + 'product'
    );
    mockRequest.flush(mockResponse);
    done();

    expect(component.productsArray.length).toEqual(2);
    expect(component.productsArray[0].title).toEqual("mockTitle");
    expect(component.productsArray[1].title).toEqual("mockTitleTwo");
  });

  it('should read an inactive product and not add it to productsArray', (done: DoneFn) => {

    const mockResponse = [{
      categoryId: 1,
      title: 'mockTitle',
      description: 'mockDescription',
      imageUri: 'mockUri',
      price: 1,
      productId: 1,
      active: false,
    }
    ]

    component.readProducts();

    const mockRequest = httpMock.expectOne(
      environment.endpointURL + 'product'
    );
    mockRequest.flush(mockResponse);
    done();

    expect(component.productsArray.length).toEqual(0);
  });

  it('should select a category and add corresponding products to selectedProductsArray', () => {

    component.productsArray.push(new Product(1, '', '', '', 1, 1));
    component.productsArray.push(new Product(2, '', '', '', 1, 2));
    component.productsArray.push(new Product(1, '', '', '', 1, 3));
    component.productsArray.push(new Product(3, '', '', '', 1, 4));

    component.selectCategory();
    expect(component.selectedProductsArray.length).toEqual(2); //only category 1 is selected by default

    component.selectedCategory = "2";
    component.selectCategory();
    expect(component.selectedProductsArray.length).toEqual(1);

    component.selectedCategory = "3";
    component.selectCategory();
    expect(component.selectedProductsArray.length).toEqual(1);
  });

  it('should split products left/ right --> two arrays for displaying two columns', () => {

    component.selectedProductsArray.push(new Product(1, 'leftOne', '', '', 1, 1));
    component.selectedProductsArray.push(new Product(1, 'rightOne', '', '', 1, 2));
    component.selectedProductsArray.push(new Product(1, 'leftTwo', '', '', 1, 3));
    component.selectedProductsArray.push(new Product(1, 'rightTwo', '', '', 1, 4));

    component.splitProductsLeftRight();

    expect(component.productsArrayLeftSide.length).toEqual(2);
    expect(component.productsArrayLeftSide[0].title).toEqual("leftOne");
    expect(component.productsArrayLeftSide[1].title).toEqual("leftTwo");

    expect(component.productsArrayRightSide.length).toEqual(2);
    expect(component.productsArrayRightSide[0].title).toEqual("rightOne");
    expect(component.productsArrayRightSide[1].title).toEqual("rightTwo");
  });

});
