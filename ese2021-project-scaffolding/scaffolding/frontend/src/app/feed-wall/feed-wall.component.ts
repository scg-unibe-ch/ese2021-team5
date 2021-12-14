import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {UserService} from "../services/user.service";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Post} from "../models/post.model";
import {User} from "../models/user.model";
import { Subscription} from "rxjs";

@Component({
  selector: 'app-community-post',
  templateUrl: './feed-wall.component.html',
  styleUrls: ['./feed-wall.component.css']
})
export class FeedWallComponent implements OnInit {

  loggedIn: boolean | undefined;

  @ Input() admin = false;

  ngOnChanges(changes: SimpleChanges){
    this.admin = changes.admin.currentValue;
  }

  userStatusChangeEventSubscription: Subscription;

  sortBy: string = 'New';
  newImageUrlButtonText: string = 'Link an image to your post!';
  newPostButtonTxt: string = "Create a new Post!";
  newPostTitle: string = '';
  newPostText: string = '';
  newPostCategory: string = '';
  newPictureLink: string = '';
  selectedCategory: string = "All";

  showNewPostWindow: boolean = false;
  showNewImageUrlField: boolean = false;
  fileSelected: boolean = false;

  newPostFlag: any = false;
  image: any;

  allPosts: Post[] = []; //contains all communityPosts
  displayPostsArray: Post[] = [];
  sortedPosts: Post[] = [];
  private deleteList: number[] = [];

  private user: User | undefined;

  private i: number = 0;


  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
  ) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
    this.user = userService.getUser();

    this.userStatusChangeEventSubscription = this.userService.getUserStatusChangeEvent().subscribe(() => {
      this.updateUserStatus();
    })
  }

  /**
   * Calls readPosts() upon initialization.
   */
  ngOnInit(): void {
    this.readPosts();
  }

  /**
   * Switches the window for creating new posts on and off.
   * Changes the text of the button to match the state.
   */
  newPost(): void {
    if(this.newPostButtonTxt === "Create a new Post!") {
      this.newPostButtonTxt = 'Cancel';
    } else {
      this.newPostButtonTxt = "Create a new Post!";
    }
    this.newPostFlag = !this.newPostFlag;
    this.showNewPostWindow = !this.showNewPostWindow;
  }

  /**
   * Disables the button for publishing a new post if required information is missing.
   */
  publishButtonDisabled(): boolean {
    return (this.newPostText === '' && !this.fileSelected && this.newPictureLink === '') || this.newPostTitle === '' || this.newPostCategory === '';
  }

  /**
   * Publishes a post and saves it to the backend.
   * Also handles image upload.
   */
  publishPost(): void {
    let containsImage = false;
    let imageId = 0;

    if (this.image != null){
      containsImage = true;
    }

    this.httpClient.post(environment.endpointURL + "post", {
      creatorId: this.userService.getUser()?.userId || 0,
      title: this.newPostTitle,
      category: this.newPostCategory,
      text: this.newPostText,
      creatorUsername: this.userService.getUser()?.username || '',
      pictureLink: this.newPictureLink,
      upvotes: 0, // broken?
      downvotes: 0,
      pictureId: 0,

    }).subscribe((post: any) => {

      if(containsImage){
        let formData = new FormData();
        formData.append('image', this.image, this.image.name);

        fetch(environment.endpointURL + "post/" + post.postId + "/image", {
            method: 'POST',
            body: formData,
          }
        ).then((response) => {
          return response.json();
        }
        ).then((imageData: any) => {
          this.httpClient.put(environment.endpointURL + "post/" + post.postId,{
            pictureId: imageData.imageId,
          }).subscribe();
          imageId = imageData.imageId;
          this.allPosts.push(new Post(post.title, post.category, post.text, post.creatorId, post.creatorUsername, post.pictureLink, imageId, post.postId, 0, []));
          this.selectCategory()
        });
      }

      if(!containsImage) {
        this.allPosts.push(new Post(post.title, post.category, post.text, post.creatorId, post.creatorUsername, post.pictureLink, imageId, post.postId, 0, []));
        this.selectCategory();
      }

      this.resetImage();
      this.newPostTitle= this.newPictureLink = this.newPostText = this.newPostCategory = '';
      this.newPost(); //resets the "new post window"

      return new Post(post.title, post.category, post.text, post.creatorId, post.creatorUsername, post.pictureLink, imageId, post.postId, 0, []);
    })
  }

  /**
   * Reads all posts from the backend, adds them to allPosts and then sorts them by calling sortPostsById().
   * feed-wall.component.html then uses displayPostsArray to display the posts.
   */
  readPosts(): void {
    this.allPosts = [];
    this.httpClient.get(environment.endpointURL + "post").subscribe((posts: any) => {
      posts.forEach((post: any) => {
        let postVotesForFrontendPostModel: any[] = [];

        post.postvotes.forEach((postVote: any) => {
          postVotesForFrontendPostModel.push(postVote.Vote);
        })

        this.allPosts.push(new Post(post.title, post.category, post.text, post.creatorId, post.creatorUsername, post.pictureLink, post.pictureId, post.postId, post.upvotes - post.downvotes, postVotesForFrontendPostModel));
      })
      this.displayPostsArray = this.allPosts;
      this.selectCategory();
      this.sortPostsById();
    })
  }

  /**
   * Deletes a selected post from the frontend and from the backend.
   * After the deletion, the remaining post are sorted again.
   * @param post, a selected post.
   */
  deletePost(post: Post): void{
    this.httpClient.delete(environment.endpointURL + "post/" + post.postId,).subscribe((deletedPost: any) => {
      if (post.pictureLink != '') {
        this.httpClient.delete(environment.endpointURL + "post/image/" + post.pictureFileName).subscribe(() => {
        });
      }
      this.allPosts.splice(this.allPosts.indexOf(post), 1);
      this.selectCategory();
      this.sortPosts();
    })
  }

  /**
   * Switches the field for adding an imageURL to a post on and off.
   * Changes the button text according to the state.
   */
  addImageByURL(): void {
    this.showNewImageUrlField = !this.showNewImageUrlField
    if (this.showNewImageUrlField){
      this.newImageUrlButtonText = "Cancel";
    } else {
      this.newImageUrlButtonText = "Link an image to your post!";
      this.newPictureLink = '';
    }
  }

  /**
   * Initializes the image from the image input.
   */
  onFileChanged(event: any): void {
    this.image = event.target.files[0];
    this.fileSelected = true;
  }

  /**
   * Resets the image.
   * Is called when a post is created, or changes are discarded.
   */
  resetImage(): void {
    this.image = null;
    this.fileSelected = false;
  }

  /**
   * Sorts posts by rank. Highest rank on top.
   */
  sortPostsByRank(): void {
    this.sortedPosts = [];
    this.allPosts.forEach((post: any) => {
      this.sortedPosts.push(post);
    })
    this.sortedPosts.sort((a, b) => b.postRank - a.postRank);
  }

  /**
   * Sorts posts by postId. As the backend gives out postIds in an ascending order,
   * this is equal to sorting posts by creation date.
   */
  sortPostsById(): void {
    this.sortedPosts = [];
    this.allPosts.forEach((post: any) => {
      this.sortedPosts.push(post);
    })
    this.sortedPosts.sort((a, b) => b.postId - a.postId);
  }

  /**
   * Sorts posts by calling the responsible sorting algorithm.
   * The algorithm can be chosen by the user, default is 'New'.
   */
  sortPosts(): void {
    switch (this.sortBy){
      case 'Score':
        this.sortPostsByRank();
        break;
      case 'New':
        this.sortPostsById();
        break;
    }
  }

  /**
   * Selects a specific category of posts to be displayed.
   * The category can be chosen by the user, default is all.
   */
  selectCategory() {
    this.sortPosts();
    this.displayPostsArray = [];
    this.sortedPosts.forEach((post: any) => {
      this.displayPostsArray.push(post);

    })
    this.deleteList = [];
    this.i = 0;

    this.displayPostsArray.forEach((post: any) => {
      if(!post.category.match(this.selectedCategory) && !this.selectedCategory.match("All")) {
        this.deleteList.push(this.sortedPosts.indexOf(post) - this.i);
        this.i++;
      }
    })
    this.deleteList.forEach((index:number)=>{
      this.displayPostsArray.splice(index,1);
      })
  }

  /**
   * Is called whenever the logged-in user changes.
   */
  private updateUserStatus() {
    this.user = this.userService.getUser();
  }
}
