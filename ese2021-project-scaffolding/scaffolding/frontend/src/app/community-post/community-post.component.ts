import {Component, OnInit, Output} from '@angular/core';
import {UserService} from "../services/user.service";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Post} from "../models/post.model";
import {User} from "../models/user.model";
import {TodoList} from "../models/todo-list.model";

@Component({
  selector: 'app-community-post',
  templateUrl: './community-post.component.html',
  styleUrls: ['./community-post.component.css']
})
export class CommunityPostComponent implements OnInit {

  loggedIn: boolean | undefined;
  admin: boolean | undefined;
  sortBy: string = 'New';
  showNewPostWindow: boolean = false;
  showNewImageUrlField: boolean = false;
  newImageUrlButtonText = 'Link an image to your post!';
  allPosts: Post[] = []; //contains all communityPosts
  displayPostsArray: Post[] = [];
  sortedPosts: Post[] = [];
  newPostTitle: string = '';
  newPostText: string = '';
  newPostCategory: string = '';
  newPictureLink: string = '';
  newPostFlag: any = false;
  newPostButtonTxt: string = "Create a new Post!";
  private user: User | undefined;
  fileSelected: boolean = false;
  image: any;
  pictureFileName: string = '';
  selectedCategory: string = "All";
  private i: number = 0;
  private deleteList: number[] = [];

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
  ) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
    this.user = userService.getUser();
  }

  ngOnInit(): void {
    console.log("oninit called");
    this.readPosts();
    this.checkAdmin();
  }

  checkAdmin():void{

    this.httpClient.get(environment.endpointURL + "admin").subscribe(() => {
      this.admin = true;},
      () => {
      this.admin = false;
    });


  }

  newPost(): void {
    if(this.newPostButtonTxt === "Create a new Post!") {
      this.newPostButtonTxt = 'Cancel';
    } else {
      this.newPostButtonTxt = "Create a new Post!";
    }
    this.newPostFlag = !this.newPostFlag;
    this.showNewPostWindow = !this.showNewPostWindow;
  }

  publishButtonDisabled(): boolean{

    return (this.newPostText === '' && !this.fileSelected && this.newPictureLink === '') || this.newPostTitle === '' || this.newPostCategory === '';
  }


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
          this.allPosts.push(new Post(post.title, post.category, post.text, post.creatorId, post.creatorUsername, post.pictureLink, imageId, post.postId, 0));
        });
      }
      if(!containsImage) {
        this.allPosts.push(new Post(post.title, post.category, post.text, post.creatorId, post.creatorUsername, post.pictureLink, imageId, post.postId, 0));
      }

      this.resetImage();
      this.newPostTitle= this.newPictureLink = this.newPostText = this.newPostCategory = '';
      this.newPost(); //resets the "new post window"
    })
  }


  readPosts(): void {
    this.httpClient.get(environment.endpointURL + "post").subscribe((posts: any) => {
      posts.forEach((post: any) => {
        this.allPosts.push(new Post(post.title, post.category, post.text, post.creatorId, post.creatorUsername, post.pictureLink, post.pictureId, post.postId, 0));
      })
    })
  }


  deletePost(post: Post): void{
    this.httpClient.delete(environment.endpointURL + "post/image/" + post.pictureFileName).subscribe();
    this.httpClient.delete(environment.endpointURL + "post/" + post.postId).subscribe(() => {
      this.allPosts.splice(this.allPosts.indexOf(post), 1);
    })

  }


  addImageByURL(): void {
    this.showNewImageUrlField = !this.showNewImageUrlField
    if (this.showNewImageUrlField){
      this.newImageUrlButtonText = "Cancel";
    } else {
      this.newImageUrlButtonText = "Link an image to your post!";
      this.newPictureLink = '';
    }
  }

  onFileChanged(event: any): void {

    this.image = event.target.files[0];
    this.fileSelected = true;
  }

  resetImage(): void {
    this.image = null;
    this.fileSelected = false;
  }

  sortPostsByRank(): void {
    this.sortedPosts = [];
    this.allPosts.forEach((post: any) => {
      this.sortedPosts.push(post);
    })
    this.sortedPosts.sort((a, b) => b.postRank - a.postRank);
  }

  sortPostsById(): void {
    this.sortedPosts = [];
    this.allPosts.forEach((post: any) => {
      this.sortedPosts.push(post);
    })
    this.sortedPosts.sort((a, b) => b.postId - a.postId);
  }

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
}
