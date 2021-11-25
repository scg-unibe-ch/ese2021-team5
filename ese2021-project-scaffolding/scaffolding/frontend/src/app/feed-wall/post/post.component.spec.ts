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

  });

  it('should not get imageFilename', () => {

    component.post.pictureId = 0;
    component.post.pictureLink = "some.link.ch";

    component.ngOnInit();

    expect(component.post.pictureLink).toEqual("some.link.ch");
  });

  it('should upvote postRank from 0 to 1 and if called again return to 0', () => {

    expect(component.post.postRank).toEqual(0);
    component.upvote();
    expect(component.post.postRank).toEqual(1);
    component.upvote();
    expect(component.post.postRank).toEqual(0);
  });

  it('should downvote postRank from 0 to -1 and if called again return to 0', () => {

    expect(component.post.postRank).toEqual(0);
    component.downvote();
    expect(component.post.postRank).toEqual(-1);
    component.downvote();
    expect(component.post.postRank).toEqual(0);
  });

  it('should enter editMode', () => {
    expect(component.editMode).toEqual(false);
    component.editPost()
    expect(component.editMode).toEqual(true);
    expect(component.editButtonText).toEqual(component.editButtonTextDiscardChanges);
    component.editPost();
    expect(component.editMode).toEqual(false);
    expect(component.editButtonText).toEqual(component.editButtonTextEdit);
  });

  it('should safe changes', (done: DoneFn) => {

    const mockResponse = {
      title: "mockTitleChanged",
      text: "mockTextChanged",
      category: "mockCategoryChanged",
    };
    component.post.postId = 1;
    component.post.title = "titleOriginal";
    component.post.text = "textOriginal";
    component.post.category = "categoryOriginal";
    component.safeChanges();

    const mockRequest = httpMock.expectOne(
      environment.endpointURL + 'post/' + component.post.postId
    )
    mockRequest.flush(mockResponse);
    done();

    expect(component.post.title).toEqual("mockTitleChanged");
    expect(component.post.text).toEqual("mockTextChanged");
    expect(component.post.category).toEqual("mockCategoryChanged");
  });

});
