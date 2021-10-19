import { Component, OnInit } from '@angular/core';
import {CommunityPost} from "../models/community-post.model";

@Component({
  selector: 'app-community-post',
  templateUrl: './community-post.component.html',
  styleUrls: ['./community-post.component.css']
})
export class CommunityPostComponent implements OnInit {

  newCommunityPost: CommunityPost = new CommunityPost(0,'','',0);

  constructor() { }

  ngOnInit(): void {
  }

  createNewPost(): void{

  }

}
