import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { FeedWallComponent } from './feed-wall.component';
import {Post} from "../models/post.model";
import {environment} from "../../environments/environment";


describe('FeedWallComponent', () => {
  let component: FeedWallComponent;
  let httpMock: HttpTestingController;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedWallComponent ],
      imports: [HttpClientTestingModule],
      providers: [FeedWallComponent]
    })
    .compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    component = TestBed.inject(FeedWallComponent);
  });

  afterEach(() => {
    httpMock.verify(); //Verifies that no requests are outstanding.
  });


  /**
   * Tests whether a new FeedWallComponent has been initialized.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('should delete a post by calling the backend and then removing it from the allPosts-array', (done: DoneFn) => {

    let mockPost = new Post('', '', '', 0, '', '', 0, 0, 0, []);

    const mockResponse = {
      pictureLink: '', //if picture link is not an empty string, the call to delete an image will be made
      status: 200,
    };

    component.allPosts.push(mockPost);
    expect(component.allPosts.length).toEqual(1);

    component.deletePost(mockPost);

    const mockRequest = httpMock.expectOne(
      'http://localhost:3000/post/0'
    );


    mockRequest.flush(mockResponse);
    done();
    expect(component.allPosts.length).toEqual(0);
  });

  it('should delete a post with an imageLink by calling the backend and then removing it from the allPosts-array', (done: DoneFn) => {

    let mockPost = new Post('', '', '', 0, '', 'link', 0, 0, 0, []);

    const mockResponse = {
      pictureLink: 'mockPictureLink.something',
      status: 200,
    };

    const mockResponseTwo = {
      status: 204,
    };

    component.allPosts.push(mockPost);
    expect(component.allPosts.length).toEqual(1);

    component.deletePost(mockPost);

    const mockRequest = httpMock.expectOne(
      'http://localhost:3000/post/0'
    );
    mockRequest.flush(mockResponse);

    const mockRequestDeleteImage = httpMock.expectOne(
      environment.endpointURL + 'post/image/'
    );
    mockRequestDeleteImage.flush(mockResponseTwo);
    done();
    expect(component.allPosts.length).toEqual(0);
  });

  it('should read two posts and create the corresponding post objects', (done: DoneFn) => {

    const mockResponse = [{
      title: "mockTitle",
      category: "mockCategory",
      text: "mockText",
      creatorId: 0,
      creatorUsername: "mockUsername",
      pictureLink: "",
      pictureId: 0,
      postId: 0,
      postRank: 0,
      postvotes: [],
    },
      {
        title: "mockTitleTwo",
        category: "mockCategoryTwo",
        text: "mockTextTwo",
        creatorId: 0,
        creatorUsername: "mockUsernameTwo",
        pictureLink: "",
        pictureId: 0,
        postId: 0,
        postRank: 0,
        postvotes: [],
      }
    ]

    component.readPosts();

    const mockRequest = httpMock.expectOne(
      environment.endpointURL + 'post'
    )
    mockRequest.flush(mockResponse);
    done();
    expect(component.allPosts.length).toEqual(2);
    expect(component.allPosts[0].title).toEqual("mockTitle");
    expect(component.allPosts[1].title).toEqual("mockTitleTwo");
  });


  it('should change from "Link an image to your post!" to "Cancel" and back', () => {

    expect(component.newImageUrlButtonText).toEqual("Link an image to your post!");
    expect(component.showNewImageUrlField).toEqual(false);

    component.addImageByURL();

    expect(component.newImageUrlButtonText).toEqual("Cancel");
    expect(component.showNewImageUrlField).toEqual(true);

    component.addImageByURL();

    expect(component.newImageUrlButtonText).toEqual("Link an image to your post!");
    expect(component.showNewImageUrlField).toEqual(false);

  });


  it('should sort posts by rank and push them to sortedPosts-array', () => {

    let mockPost = new Post('', '', '', 0, '', '', 0, 0, 1, []);
    let mockPostTwo = new Post('', '', '', 0, '', '', 0, 0, 0, []);
    let mockPostThree = new Post('', '', '', 0, '', '', 0, 0, 3, []);
    let mockPostFour = new Post('', '', '', 0, '', '', 0, 0, 0, []);

    component.allPosts.push(mockPost);
    component.allPosts.push(mockPostTwo);
    component.allPosts.push(mockPostThree);
    component.allPosts.push(mockPostFour);

    component.sortBy = 'Score';
    component.sortPosts();

    expect(component.sortedPosts[0].postRank >= component.sortedPosts[1].postRank).toBeTruthy();
    expect(component.sortedPosts[1].postRank >= component.sortedPosts[2].postRank).toBeTruthy();
    expect(component.sortedPosts[2].postRank >= component.sortedPosts[3].postRank).toBeTruthy();
  });

  it('should sort posts by publishing date (uses the postId) and push them to sortedPosts-array', () => {

    let mockPost = new Post('', '', '', 0, '', '', 0, 19, 0, []);
    let mockPostTwo = new Post('', '', '', 0, '', '', 0, 2, 0, []);
    let mockPostThree = new Post('', '', '', 0, '', '', 0, 22, 0, []);
    let mockPostFour = new Post('', '', '', 0, '', '', 0, 22, 0, []);

    component.allPosts.push(mockPost);
    component.allPosts.push(mockPostTwo);
    component.allPosts.push(mockPostThree);
    component.allPosts.push(mockPostFour);

    component.sortBy = 'New';
    component.sortPosts();

    expect(component.sortedPosts[0].postId >= component.sortedPosts[1].postId).toBeTruthy();
    expect(component.sortedPosts[1].postId >= component.sortedPosts[2].postId).toBeTruthy();
    expect(component.sortedPosts[2].postId >= component.sortedPosts[3].postId).toBeTruthy();
  });

  it('should only add posts of category 1 to displayPostsArray-array', () => {

    let mockPost = new Post('', 'category 1', '', 0, '', '', 0, 0, 0, []);
    let mockPostTwo = new Post('', 'category 2', '', 0, '', '', 0, 0, 0, []);
    let mockPostThree = new Post('', 'category 3', '', 0, '', '', 0, 0, 0, []);
    let mockPostFour = new Post('', 'category 1', '', 0, '', '', 0, 0, 0, []);

    component.allPosts.push(mockPost);
    component.allPosts.push(mockPostTwo);
    component.allPosts.push(mockPostThree);
    component.allPosts.push(mockPostFour);

    component.selectedCategory = 'category 1';
    component.selectCategory();

    expect(component.displayPostsArray.length).toEqual(2);
    expect(component.displayPostsArray[0].category == "category 1" && component.displayPostsArray[1].category == "category 1");
  });

});
