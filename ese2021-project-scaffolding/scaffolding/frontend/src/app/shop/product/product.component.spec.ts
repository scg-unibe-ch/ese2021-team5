import { TestBed } from '@angular/core/testing';

import { ProductComponent } from './product.component';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('ProductComponent', () => {
  let component: ProductComponent;
  let httpMock: HttpTestingController

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductComponent ],
      imports: [HttpClientTestingModule],
      providers: [ProductComponent]
    })
    .compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    component = TestBed.inject(ProductComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
