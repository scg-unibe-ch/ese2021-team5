import { TestBed } from '@angular/core/testing';

import { ShowOrdersComponent } from './ShowOrders.component';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {environment} from "../../environments/environment";

describe('ShowOrdersComponent', () => {
  let component: ShowOrdersComponent;
  let httpMock: HttpTestingController;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowOrdersComponent ],
      imports: [HttpClientTestingModule],
      providers: [ShowOrdersComponent],
    })
      .compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    component = TestBed.inject(ShowOrdersComponent);
  });

  afterEach(() => {
    httpMock.verify(); //Verifies that no requests are outstanding.
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check whether a user is an admin --> user is admin', (done: DoneFn) => {

    const mockResponse = {
      status: 200,
      statusText: 'OK'
    };

    component.checkAdmin();

    const mockRequest = httpMock.expectOne(
      environment.endpointURL + 'admin'
    );
    mockRequest.flush("", mockResponse);
    done();

    expect(component.admin).toEqual(true);
  });

  it('should check whether a user is an admin --> user is no admin', (done: DoneFn) => {

    const mockResponse = {
      status: 403,
      statusText: 'Forbidden'
    };

    component.checkAdmin();

    const mockRequest = httpMock.expectOne(
      environment.endpointURL + 'admin'
    );
    mockRequest.flush("", mockResponse);
    done();

    expect(component.admin).toEqual(false);
  });

});
