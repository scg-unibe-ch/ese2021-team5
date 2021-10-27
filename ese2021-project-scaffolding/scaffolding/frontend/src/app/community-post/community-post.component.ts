import {Component, OnInit, Output} from '@angular/core';
import {UserService} from "../services/user.service";
import {TodoList} from "../models/todo-list.model";
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
  allPosts: Post[] = []; //contains all communityPosts
  newPostTitle: string = '';
  newPostText: string = '';
  newPostImage: any;
  newPostFlag: any = false;
  newPostButtonTxt: string = "Create a new Post!";
  private user: User | undefined;

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

  publishPost(): void{
    this.allPosts.push(new Post(this.newPostTitle, this.newPostText, this.userService.getUser()?.userId || 0, this.userService.getUser()?.username || '')); //0 means that there is an error --> this will cause problems at some point
    this.newPostTitle = '';
    this.newPostText = '';
  }

  deletePost(post: Post): void{
    this.allPosts.splice(this.allPosts.indexOf(post), 1)
  }

    //this.httpClient.post(environment.endpointURL + "todolist", {
    //}).subscribe((list: any) => {
    //})}


}
