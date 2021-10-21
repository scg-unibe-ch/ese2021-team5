import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-community-post',
  templateUrl: './community-post.component.html',
  styleUrls: ['./community-post.component.css']
})
export class CommunityPostComponent implements OnInit {

  loggedIn: boolean | undefined;
  showNewPostWindow: boolean = false;

  constructor(
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

  }

}
