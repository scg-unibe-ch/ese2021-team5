import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TodoList} from "../../models/todo-list.model";
import {Post} from "../../models/post.model";
import {UserService} from "../../services/user.service";
import {HttpClient} from "@angular/common/http";
import {User} from "../../models/user.model";
import {Account} from "../../models/account.model";
import {environment} from "../../../environments/environment";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input()
  post: Post = new Post('','','',0, '', '', 0, 0, 0, []);

  @ Input()
  admin = false;

  userStatusChangeEventSubscription: Subscription;

  imageURL: any;
  upvoteFlag: any = false;
  downvoteFlag: any = false;
  editMode: boolean = false;

  editButtonTextEdit: string = "Edit Post";
  editButtonTextDiscardChanges: string = "Discard Changes";
  editButtonText: string = this.editButtonTextEdit;
  deleteButtonText: string = "Delete your Post!";
  updatePostTitle: string = '';
  updatePostText: string = '';
  updatePostCategory: string = '';

  @Output()
  delete = new EventEmitter<Post>();
  upvoted: boolean = false;
  downvoted: boolean = false;

  constructor(
    public userService: UserService,
    public httpClient: HttpClient
  ) {
    this.userStatusChangeEventSubscription = this.userService.getUserStatusChangeEvent().subscribe(() => {
      this.updateUserStatus();
    })
  }

  /**
   * Initializes the pictureLink, if it hasn't been initialized yet. This is necessary, as the backend changes the filename when saving an image.
   * Calls updateUserVotes() to display earlier up/downvotes to the user.
   */
  ngOnInit(): void {

    if (this.post.pictureLink == '' && this.post.pictureId != 0) {
      this.httpClient.get(environment.endpointURL + "post/" + this.post.pictureId + "/image").subscribe((image: any) => {
          this.post.pictureLink = environment.endpointURL + "public/" + image.fileName;
          this.post.pictureFileName = image.fileName;
        }
      )
    }

   this.updateUserVotes();

    if (this.admin){
      this.deleteButtonText = "Delete post! Creator: -" + this.post.creatorUsername + "-";
    }
  }

  /**
   * Sets the upvote/ downvoteFlag according to a vote in an earlier session.
   * There is a rare case, where userService.getUser returns undefined when onInit() of this component is called. In that case the methode pauses and then tries again.
   */
  updateUserVotes(): void{
    this.upvoteFlag = this.downvoteFlag = false;
    this.post.postVotes.forEach((postVote: any) => {
      if (postVote.userId == this.userService.getUser()?.userId){
        if (postVote.type == 1){
          this.upvoteFlag = true;
        } else if (postVote.type == -1){
          this.downvoteFlag = true;
        }
      }
    })

    if (typeof this.userService.getUser() == "undefined" && this.loggedIn()){
      console.log("check");
      setTimeout(this.updateUserVotes, 500);
    }

  }

  /**
   * Emits an event that that deletes the post in feed-wall.component.ts#deletePost().
   */
  deletePost(): void {
    this.delete.emit(this.post);
  }

  /**
   * Returns true if the post belongs to the logged-in user.
   */
  myOwnPost(): boolean {
    let thisIsMyPost: boolean = false;
    if((this.userService.getUser()?.userId || 0) == this.post.creatorId){ //0 stands for an error
      thisIsMyPost = true;
    }
    return thisIsMyPost;
  }

  /**
   * Returns true if the a user is logged in.
   */
  loggedIn(): boolean {
    return this.userService.getLoggedIn() || false;
  }

  /**
   * Upvotes or removes a vote from a post and sends the according http request to the backend.
   */
  upvote(): void{
      if(this.downvoteFlag){

      this.post.postRank++;
      this.downvoteFlag = false;
    }
      if(!this.upvoteFlag) {
        this.httpClient.put(environment.endpointURL + "post/" + this.post.postId + "/upvote", {
          userId: this.userService.getUser()?.userId,
        }).subscribe( () => {
        })
        this.post.postRank++;

      } else {
          this.httpClient.put(environment.endpointURL + "post/" + this.post.postId + "/removeUpvote", {
            userId: this.userService.getUser()?.userId,
          }).subscribe( () => {
          })
        this.post.postRank--;
      }

    this.upvoteFlag = !this.upvoteFlag;
  }

  /**
   * Downvotes or removes a vote from a post and sends the according http request to the backend.
   */
  downvote(): void{
    if(this.upvoteFlag){

      this.post.postRank--;
      this.upvoteFlag = false;
    }
      if(!this.downvoteFlag){
        this.httpClient.put(environment.endpointURL + "post/" + this.post.postId + "/downvote", {
          userId: this.userService.getUser()?.userId,
        }).subscribe( () => {
        })
        this.post.postRank--;
      } else {
        this.httpClient.put(environment.endpointURL + "post/" + this.post.postId + "/removeDownvote", {
          userId: this.userService.getUser()?.userId,
        }).subscribe( () => {

        })
        this.post.postRank++;
      }
      this.downvoteFlag = !this.downvoteFlag;
  }

  /**
   * Switches to editMode, so that a user can edit his post.
   */
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

  /**
   * Safes changes of an edited post to the backend.
   */
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

  /**
   * Is called when user.component.ts or app.component.ts emit a userStatusChangeEvent.
   */
  updateUserStatus(): void {
    if (this.admin){
      this.deleteButtonText = "Delete post! Creator: -" + this.post.creatorUsername + "-";
    } else {this.deleteButtonText = "Delete your Post!"}

    this.updateUserVotes();
  }
}
