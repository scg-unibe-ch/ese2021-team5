import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TodoList} from "../../models/todo-list.model";
import {Post} from "../../models/post.model";
import {UserService} from "../../services/user.service";
import {HttpClient} from "@angular/common/http";
import {User} from "../../models/user.model";
import {Account} from "../../models/account.model";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input()
  post: Post = new Post('','','',0, '', '', '', 0, 0);

  imageURL: any;
  editMode: boolean = false;
  editButtonTextEdit: string = "Edit Post";
  editButtonTextDiscardChanges: string = "Discard Changes";
  editButtonText: string = this.editButtonTextEdit;
  updatePostTitle: string = '';
  updatePostText: string = '';
  updatePostCategory: string = '';
  upvoteFlag: any = false;
  downvoteFlag: any = false;

  @Output()
  delete = new EventEmitter<Post>();
  upvoted: boolean = false;
  downvoted: boolean = false;
  admin: boolean | undefined;

  constructor(
    public userService: UserService,
    public httpClient: HttpClient
  ) {
  }

  ngOnInit(): void {
    //this.checkAdmin();
  }

  deletePost(): void {
    this.delete.emit(this.post);
  }

  myOwnPost(): boolean {
    let thisIsMyPost: boolean = false;
    if((this.userService.getUser()?.userId || 0) == this.post.creatorId){ //0 stands for an error
      thisIsMyPost = true;
    }
    return thisIsMyPost;
  }

  createAnswer(): void {

  }

  loggedIn(): boolean {
    return this.userService.getLoggedIn() || false;
  }

  checkAdmin(): void {
    this.httpClient.get(environment.endpointURL + "admin").subscribe(() => {
        this.admin = true;
        },
      () => {
        this.admin = false;
      });
  }

  upvote(): void{
      if(!this.upvoteFlag) {
        this.post.postRank++;
      } else {
        this.post.postRank--;
      }
      if(this.downvoteFlag){
        this.downvote();
      }
    this.upvoteFlag = !this.upvoteFlag;
  }

  downvote(): void{
      if(!this.downvoteFlag){
        this.post.postRank--;
      } else {
        this.post.postRank++;
      }
      if(this.upvoteFlag){
        this.upvote();
      }
      this.downvoteFlag = !this.downvoteFlag;
  }

  editPost() {
    this.editMode = !this.editMode;
    this.updatePostTitle = this.post.title;
    this.updatePostText = this.post.text;
    this.updatePostCategory = this.post.category;
    if (this.editButtonText == this.editButtonTextEdit){
      this.editButtonText = this.editButtonTextDiscardChanges
    } else {
      this.editButtonText = this.editButtonTextEdit;
    }
  }

  safeChanges() {
    this.httpClient.put(environment.endpointURL + "post/" + this.post.postId, {
      title: this.updatePostTitle,
      text: this.updatePostText,
      category: this.updatePostCategory,
    }).subscribe( (post: any) => {
      this.editPost();
      this.post.title = post.title;
      this.post.text = post.text;
      this.post.category = post.category;
      }
    )
  }
}
