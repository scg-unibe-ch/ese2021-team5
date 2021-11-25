import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostComponent } from './post.component';
import {FeedWallComponent} from "../feed-wall.component";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {environment} from "../../../environments/environment";

describe('PostComponent', () => {
  let component: PostComponent;
  let httpMock: HttpTestingController;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostComponent ],
      imports: [HttpClientTestingModule],
      providers: [PostComponent]
    })
      .compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    component = TestBed.inject(PostComponent);
  });

  afterEach(() => {
    httpMock.verify(); //Verifies that no requests are outstanding.
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get image fileName', (done: DoneFn) => {

    const mockResponse = {
      fileName: "mockFilename",
    }
    component.post.pictureId = 1;

    component.ngOnInit();

    const mockRequest = httpMock.expectOne(
      environment.endpointURL + 'post/' + component.post.pictureId + "/image"
    )
    mockRequest.flush(mockResponse);
    done();

    expect(component.post.pictureLink).toEqual(environment.endpointURL + "public/mockFilename");

  })

});
