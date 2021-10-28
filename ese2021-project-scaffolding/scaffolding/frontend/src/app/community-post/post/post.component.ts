import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TodoList} from "../../models/todo-list.model";
import {Post} from "../../models/post.model";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user.model";
import {Account} from "../../models/account.model";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input()
  post: Post = new Post('','','',0, '', '');

  @Output()
  delete = new EventEmitter<Post>();
  upvoted: boolean = false;
  downvoted: boolean = false;

  constructor(
    public userService: UserService
  ) {
  }

  ngOnInit(): void {

  }

  deletePost(): void {
    this.delete.emit(this.post);
  }

  myOwnPost(): boolean {
    let thisIsMyPost: boolean = false;
    if((this.userService.getUser()?.userId || 0) === this.post.creatorId){ //0 stands for an error
      thisIsMyPost = true;
    }
    return thisIsMyPost;
  }

  createAnswer(): void {

  }

  loggedIn(): boolean {
    return this.userService.getLoggedIn() || false;
  }

  upvote(): void{
    if(this.upvoted){
      //send -1 upvote to backend
    } else{
      //send +1 upvote to backend
    }
    if(this.downvoted){
      //send -1 downvote to backend
    }
    this.upvoted = !this.upvoted;
    this.downvoted = false;
  }

  downvote(): void{
    if(this.downvoted){
      //send -1 downvote to backend
    } else{
      //send +1 downvote to backend
    }
    if(this.upvoted){
      //send -1 upvote to backend
    }
    this.downvoted = !this.downvoted;
    this.upvoted = false;
  }

}
