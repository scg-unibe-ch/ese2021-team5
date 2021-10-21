import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";
import {TodoList} from "../models/todo-list.model";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Post} from "../models/post.model";

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

  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
  }

  ngOnInit(): void {
  }

  newPost(): void {
    if(this.showNewPostWindow === false){
      this.showNewPostWindow = true;
    } else {
      this.showNewPostWindow = false;
    }
  }

  publishPost(): void{
    this.allPosts.push(new Post(this.newPostTitle));
    this.newPostTitle = '';
  }

    //this.httpClient.post(environment.endpointURL + "todolist", {
    //}).subscribe((list: any) => {
    //})}

}
