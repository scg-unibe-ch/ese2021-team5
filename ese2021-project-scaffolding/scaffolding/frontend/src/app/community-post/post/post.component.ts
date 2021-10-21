import {Component, Input, OnInit} from '@angular/core';
import {TodoList} from "../../models/todo-list.model";
import {Post} from "../../models/post.model";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input()
  post: Post = new Post('');

  constructor() { }

  ngOnInit(): void {
  }

}
