import {Component, OnInit, Output} from '@angular/core';
import {UserService} from "../services/user.service";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Post} from "../models/post.model";
import {User} from "../models/user.model";

@Component({
  selector: 'app-community-post',
  templateUrl: './community-post.component.html',
  styleUrls: ['./community-post.component.css']
})
export class CommunityPostComponent implements OnInit {

  loggedIn: boolean | undefined;
  showNewPostWindow: boolean = false;
  showNewImageUrlField: boolean = false;
  newImageUrlButtonText = 'Link an image to your post!';
  allPosts: Post[] = []; //contains all communityPosts
  newPostTitle: string = '';
  newPostText: string = '';
  newPostCategory: string = '';
  newPostImage: any;
  newPictureLink: string = '';
  newPostFlag: any = false;
  newPostButtonTxt: string = "Create a new Post!";
  private user: User | undefined;
  fileSelected: boolean = false;
  image: any;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
  ) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
    this.user = userService.getUser();
  }

  ngOnInit(): void {
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
    return this.newPostText === '' || this.newPostTitle === '' || this.newPostCategory === '';
  }

  publishPost(): void{
    this.allPosts.push(new Post(this.newPostTitle, this.newPostCategory, this.newPostText, this.userService.getUser()?.userId || 0, this.userService.getUser()?.username || '', this.newPictureLink)); //0 means that there is an error --> this will cause problems at some point
    this.newPostTitle= this.newPictureLink = this.newPostText = this.newPostCategory = '';
  }

  deletePost(post: Post): void{
    this.allPosts.splice(this.allPosts.indexOf(post), 1)
  }

    //this.httpClient.post(environment.endpointURL + "todolist", {
    //}).subscribe((list: any) => {
    //})}


  addImageByURL(): void {
    this.showNewImageUrlField = !this.showNewImageUrlField
    if (this.showNewImageUrlField){
      this.newImageUrlButtonText = "Cancel";
    } else {
      this.newImageUrlButtonText = "Link an image to your post!";
      this.newPictureLink = '';
    }
  }

  onFileChanged(event: any) {
    this.image = event.target.files[0];
    console.log(this.image);
    this.fileSelected = true;
  }

  deleteImage() {
    this.image = null;
    this.fileSelected = false;
  }

}
